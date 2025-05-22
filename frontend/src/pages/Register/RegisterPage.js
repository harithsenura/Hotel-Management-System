"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import Input from "../../components/Input/Input"
import Title from "../../components/Title/Title"
import classes from "./registerPage.module.css"
import Button from "../../components/Button/Button"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { register as registerUser, getUser } from "../services/userService"
import { toast } from "react-toastify"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnUrl = params.get("returnUrl") || "/"

  // Check if user is already logged in
  useEffect(() => {
    const user = getUser()
    if (user) {
      navigate(returnUrl)
    }
  }, [navigate, returnUrl])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const submit = async (data) => {
    try {
      await registerUser(data)
      toast.success("Registration successful! You are now logged in.")
      navigate(returnUrl)
    } catch (error) {
      let errorMessage = "Registration failed. Please try again."

      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string" ? error.response.data : error.response.data.message || errorMessage
      }

      toast.error(errorMessage)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Register" />
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

          <Button type="submit" text="Register" />

          <div className={classes.login}>
            Already a user? &nbsp;
            <Link to={`/login${returnUrl ? "?returnUrl=" + returnUrl : ""}`}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
