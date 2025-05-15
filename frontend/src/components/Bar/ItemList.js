"use client"

import { useState } from "react"
import { Button, Card, Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import axios from "axios"

const ItemList = ({ item, addToCart }) => {
  const dispatch = useDispatch()
  const [imageUrl, setImageUrl] = useState(item.image)
  const [loading, setLoading] = useState(false)

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart()
  }

  // Handle image upload
  const handleImageUpload = async (file) => {
    setLoading(true)

    // Create form data
    const formData = new FormData()
    formData.append("image", file)

    try {
      // Upload image to server
      const response = await axios.post("/api/items/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Update item with new image URL
      if (response.data.imageUrl) {
        const updateResponse = await axios.put("/api/items/edit-item", {
          itemId: item._id,
          image: response.data.imageUrl,
        })

        if (updateResponse.status === 200) {
          setImageUrl(response.data.imageUrl)
          message.success("Image uploaded successfully")
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      message.error("Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  const { Meta } = Card

  // Define styles for the card and button
  const cardStyle = {
    width: "100%",
    marginBottom: 20,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    overflow: "hidden",
  }

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#800000",
    color: "#fff",
    border: "none",
    marginTop: "10px",
  }

  // Styles for hover effect
  const hoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
  }

  // Upload props
  const uploadProps = {
    name: "image",
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("You can only upload image files!")
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!")
        return false
      }

      handleImageUpload(file)
      return false // Prevent default upload behavior
    },
  }

  return (
    <div>
      <Card
        style={cardStyle}
        cover={
          <div className="image-container" style={{ position: "relative", height: 200 }}>
            <img
              alt={item.name}
              src={imageUrl || "/placeholder.svg"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              className="upload-overlay"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "5px",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "0 0 0 8px",
              }}
            >
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  size="small"
                  loading={loading}
                  style={{ background: "transparent", border: "none", color: "white" }}
                />
              </Upload>
            </div>
          </div>
        }
        className="item-card"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = hoverStyle.transform
          e.currentTarget.style.boxShadow = hoverStyle.boxShadow
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = cardStyle.boxShadow
        }}
      >
        <Meta title={item.name} />

        {/* Display prices if they are greater than zero */}
        <div style={{ margin: "10px 0", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
          {Number.parseFloat(item.price) > 0 && <div>LKR {Number.parseFloat(item.price).toFixed(2)}</div>}
          {Number.parseFloat(item.Bprice) > 0 && <div>Bottle: LKR {Number.parseFloat(item.Bprice).toFixed(2)}</div>}
          {Number.parseFloat(item.Sprice) > 0 && <div>Shot: LKR {Number.parseFloat(item.Sprice).toFixed(2)}</div>}
        </div>

        <p style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>{item.description}</p>
        <div className="item-button">
          <Button style={buttonStyle} onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ItemList
