"use client"

import { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import SideBar from "../SideBar/CustomerSideBar"

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    roomType: "",
    price: "",
    roomNumber: "",
    facilities: "",
    bedType: "",
    status: "",
  })

  // Updated state for multiple images
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setRoomData({
      ...roomData,
      [name]: value,
    })
  }

  // Updated image change handler for multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setImages([...images, ...files])

      // Create preview URLs for the selected images
      const newPreviews = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result)
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Remove an image from the list
  const removeImage = (index) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  // Update the form submission to correctly handle multiple images
  const handleSubmit = (e) => {
    e.preventDefault()

    // Price validation
    if (isNaN(roomData.price) || roomData.price <= 0) {
      setAlertMessage("Price must be a positive number")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    // Facilities validation
    if (!isNaN(roomData.facilities)) {
      setAlertMessage("Facilities cannot be a number")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    // Validate at least one image is uploaded
    if (images.length === 0) {
      setAlertMessage("Please upload at least one room image")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    // Create FormData object to send images with other data
    const formData = new FormData()

    // Append all room data to FormData
    Object.keys(roomData).forEach((key) => {
      formData.append(key, roomData[key])
    })

    // Append all images - use the same field name for all images
    images.forEach((image, index) => {
      formData.append("roomImages", image)
    })

    // Update the API call to use FormData with the correct content type
    axios
      .post("http://localhost:5001/room/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setAlertMessage("Room Added Successfully")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
        setRoomData({
          roomType: "",
          price: "",
          roomNumber: "",
          facilities: "",
          bedType: "",
          status: "",
        })
        setImages([])
        setImagePreviews([])
      })
      .catch((err) => {
        console.error(err)
        setAlertMessage("Error Adding Room")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
  }

  return (
    <>
      <SideBar />
      <div style={formContainerStyle}>
        <h2>Add Room</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Room Type</label>
            <select name="roomType" value={roomData.roomType} onChange={handleChange} required style={inputStyle}>
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="VIP">VIP</option>
              <option value="King">King</option>
              <option value="Flex">Flex</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Price</label>
            <input
              type="number"
              name="price"
              value={roomData.price}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Room Number</label>
            <input
              type="number"
              name="roomNumber"
              value={roomData.roomNumber}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Facilities (comma-separated)</label>
            <input
              type="text"
              name="facilities"
              value={roomData.facilities}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bed Type</label>
            <select name="bedType" value={roomData.bedType} onChange={handleChange} required style={inputStyle}>
              <option value="">Select Bed Type</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={roomData.status} onChange={handleChange} required style={inputStyle}>
              <option value="">Select Status</option>
              <option value="Available" style={{ color: "green" }}>
                Available
              </option>
              <option value="Reserved" style={{ color: "blue" }}>
                Reserved
              </option>
              <option value="Booked" style={{ color: "red" }}>
                Booked
              </option>
            </select>
          </div>

          {/* Updated image upload field for multiple images */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Room Images</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={fileInputStyle} multiple />
            <div style={imageGalleryStyle}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={imagePreviewContainerStyle}>
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Room Preview ${index + 1}`}
                    style={imagePreviewStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={removeButtonStyle}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Add Room
          </button>
        </form>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// Styles
const formContainerStyle = {
  maxWidth: "800px",
  padding: "20px",
  marginLeft: "450px",
  marginTop: "150px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
}

const formGroupStyle = {
  flex: "1 1 45%",
  display: "flex",
  flexDirection: "column",
}

const labelStyle = {
  marginBottom: "5px",
  fontWeight: "bold",
}

const inputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
}

// Updated styles for file input and image previews
const fileInputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
}

const imageGalleryStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "10px",
}

const imagePreviewContainerStyle = {
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "5px",
  backgroundColor: "#fff",
  width: "calc(33.333% - 10px)",
  marginBottom: "10px",
}

const imagePreviewStyle = {
  width: "100%",
  height: "120px",
  objectFit: "cover",
  borderRadius: "4px",
}

const removeButtonStyle = {
  position: "absolute",
  top: "-10px",
  right: "-10px",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#ff4d4f",
  color: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
}

const alertStyle = {
  backgroundColor: "#ffffff",
  color: "#800000",
  padding: "10px",
  borderRadius: "5px",
  marginTop: "20px",
  textAlign: "center",
  position: "fixed",
  top: "20px",
  right: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
  width: "300px",
}

export default AddRoom
