"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import api from "../services/api" // Import the custom axios instance
import { toast } from "react-toastify"
import Input from "../components/Input/Input"
import Title from "../components/Title/Title"
import Button from "../components/Button/Button"
import classes from "./registerPage.module.css"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const returnUrl = params.get("returnUrl") || "/"

  // Check if user is already logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && (user.id || user._id)) {
          navigate(returnUrl)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [navigate, returnUrl])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const submit = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post(`/api/users/register`, data)

      // Check if response has data
      if (!response || !response.data) {
        throw new Error("Empty response from server")
      }

      // Validate the user data
      const userData = response.data
      if (!userData || (!userData.id && !userData._id)) {
        console.error("Invalid user data received:", userData)
        throw new Error("Invalid user data received from server")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      toast.success("Registration successful! You are now logged in.")
      navigate(returnUrl)
    } catch (err) {
      console.error("Registration error:", err)

      // Handle different types of errors
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const serverError = err.response.data || "Server error"
        setError(typeof serverError === "string" ? serverError : "Registration failed")
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.")
      } else {
        // Something else happened while setting up the request
        setError(err.message || "An error occurred during registration")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Register" />

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="text"
            label="Name"
            {...register("name", {
              required: true,
              minLength: 5,
            })}
            error={errors.name}
          />

          <Input
            type="email"
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                message: "Email Is Not Valid",
              },
            })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            {...register("password", {
              required: true,
              minLength: 5,
            })}
            error={errors.password}
          />

          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => (value !== getValues("password") ? "Passwords Do No Match" : true),
            })}
            error={errors.confirmPassword}
          />

          <Input
            type="text"
            label="Address"
            {...register("address", {
              required: true,
              minLength: 10,
            })}
            error={errors.address}
          />

          <Button type="submit" text={loading ? "Registering..." : "Register"} disabled={loading} />

          <div className={classes.login}>
            Already a user? &nbsp;
            <Link to={`/login${returnUrl ? "?returnUrl=" + returnUrl : ""}`}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
