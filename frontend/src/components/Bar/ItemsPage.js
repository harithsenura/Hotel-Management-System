"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { DeleteOutlined, EditOutlined, UploadOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons"
import axios from "axios"
import { FaPrint } from "react-icons/fa"
import { Modal, Button, Table, Form, Input, Select, message, Tag, Space, Divider } from "antd"
import { jsPDF } from "jspdf"
import logo from "../../images/company.png"
import SideBar from "../SideBar/BarSideBar"

const ItemPage = () => {
  const dispatch = useDispatch()
  const [itemsData, setItemsData] = useState([])
  const [popupModal, setPopModal] = useState(false)
  const [editItem, SetEdititem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [form] = Form.useForm()
  const fileInputRef = useRef(null)
  const [serverUrl, setServerUrl] = useState("http://localhost:5001")
  const [ingredients, setIngredients] = useState([])
  const [newIngredient, setNewIngredient] = useState({ name: "", price: "0", isDefault: false })
  const [selectedCategory, setSelectedCategory] = useState(editItem?.category || "")

  // Function to fetch items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" })
      const { data } = await axios.get("/api/items/get-item")
      console.log("Items fetched:", data)
      setItemsData(data)
      dispatch({ type: "HIDE_LOADING" })
    } catch (error) {
      console.log(error)
      dispatch({ type: "HIDE_LOADING" })
    }
  }

  useEffect(() => {
    getAllItems()
  }, [])

  useEffect(() => {
    if (editItem && editItem.ingredients) {
      setIngredients(editItem.ingredients)
      setSelectedCategory(editItem.category || "")
    } else {
      setIngredients([])
    }
  }, [editItem])

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" })
      await axios.delete(`/api/items/delete-item/${record._id}`)
      message.success("Item Deleted Successfully!")
      getAllItems()
      setPopModal(false)
      dispatch({ type: "HIDE_LOADING" })
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" })
      console.log(error)
      message.error("Something Went Wrong!")
    }
  }

  // Filtered data based on search term
  const filteredItems = itemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.Bprice && item.Bprice.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.Sprice && item.Sprice.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Function to generate PDF
  const generatePDF = async () => {
    const doc = new jsPDF()
    doc.addImage(logo, "PNG", 10, 10, 25, 13)
    doc.setFontSize(8)
    doc.setTextColor(0)
    doc.text("Your Company Name", 10, 30)
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35)
    doc.text("Contact: (123) 456-7890", 10, 40)
    doc.text("Email: info@yourcompany.com", 10, 45)
    doc.setFontSize(18)
    doc.setTextColor(0)
    const headingY = 60
    doc.text("Item Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" })
    const headingWidth = doc.getTextWidth("Item Management")
    const underlineY = headingY + 1
    doc.setDrawColor(0)
    doc.line(
      doc.internal.pageSize.getWidth() / 2 - headingWidth / 2,
      underlineY,
      doc.internal.pageSize.getWidth() / 2 + headingWidth / 2,
      underlineY,
    )
    doc.setFontSize(12)
    doc.text("Item List", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" })
    const headers = ["No", "Name", "Bottle Price", "Shot Price", "Price"]
    const data = filteredItems.map((item, index) => [
      index + 1,
      item.name,
      `$${item.Bprice || 0}`,
      `$${item.Sprice || 0}`,
      `$${item.price || 0}`,
    ])
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: {
        fontSize: 8,
      },
    })
    const endingY = doc.internal.pageSize.getHeight() - 30
    doc.setFontSize(10)
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" })
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10)
    doc.save("items_report.pdf")
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      message.error("Please upload an image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must be smaller than 2MB")
      return
    }

    setImageFile(file)

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/50?text=No+Image"

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) return imagePath

    // If it's a relative path, prepend the server URL
    return `${serverUrl}${imagePath}`
  }

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) {
      message.error("Ingredient name is required")
      return
    }

    const updatedIngredients = [...ingredients, { ...newIngredient }]
    setIngredients(updatedIngredients)
    setNewIngredient({ name: "", price: "0", isDefault: false })
  }

  // Handle removing an ingredient
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...ingredients]
    updatedIngredients.splice(index, 1)
    setIngredients(updatedIngredients)
  }

  // Handle toggling default status of an ingredient
  const handleToggleDefault = (index) => {
    const updatedIngredients = [...ingredients]
    updatedIngredients[index].isDefault = !updatedIngredients[index].isDefault
    setIngredients(updatedIngredients)
  }

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value)

    // If changing to foods category, set default values for bottle and shot price
    if (value === "foods") {
      form.setFieldsValue({
        Bprice: "0",
        Sprice: "0",
      })
    }
  }

  // Check if the selected category is "foods"
  const isFoodCategory = selectedCategory === "foods"

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => {
        const fullImageUrl = getFullImageUrl(image)
        console.log("Image URL for", record.name, ":", fullImageUrl)

        return (
          <div style={{ position: "relative", width: "50px", height: "50px" }}>
            <img
              src={fullImageUrl || "/placeholder.svg"}
              alt={record.name}
              width="50"
              height="50"
              style={{
                borderRadius: "8px",
                objectFit: "cover",
              }}
              onError={(e) => {
                console.error("Image failed to load:", fullImageUrl)
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/50?text=No+Image"
              }}
            />
          </div>
        )
      },
    },
    {
      title: "Bottle Price",
      dataIndex: "Bprice",
      render: (text, record) => {
        return record.category === "foods" ? "-" : text
      },
    },
    {
      title: "Shot Price",
      dataIndex: "Sprice",
      render: (text, record) => {
        return record.category === "foods" ? "-" : text
      },
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Ingredients",
      dataIndex: "ingredients",
      render: (ingredients) => (
        <div>
          {ingredients && ingredients.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {ingredients.slice(0, 3).map((ing, index) => (
                <Tag color={ing.isDefault ? "green" : "blue"} key={index}>
                  {ing.name}
                </Tag>
              ))}
              {ingredients.length > 3 && <Tag>+{ingredients.length - 3} more</Tag>}
            </div>
          ) : (
            <span style={{ color: "#999" }}>No ingredients</span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              SetEdititem(record)
              setPopModal(true)
              setImagePreview(record.image ? getFullImageUrl(record.image) : "")
              setSelectedCategory(record.category || "")
              form.setFieldsValue({
                ...record,
                image: record.image,
              })
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => {
              handleDelete(record)
            }}
          />
        </div>
      ),
    },
  ]

  // Handle form submit for adding/editing items
  const handleSubmit = async (values) => {
    try {
      dispatch({ type: "SHOW_LOADING" })

      let imageUrl = values.image

      // If there's a new image file, upload it first
      if (imageFile) {
        const formData = new FormData()
        formData.append("image", imageFile)

        const uploadResponse = await axios.post("/api/upload/item-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        if (uploadResponse.data && uploadResponse.data.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl
          console.log("New image URL:", imageUrl)
        } else {
          throw new Error("Image upload failed")
        }
      }

      // Now proceed with item creation/update with the image URL
      if (editItem === null) {
        // Add new item
        const res = await axios.post("/api/items/add-item", {
          ...values,
          image: imageUrl,
          ingredients: ingredients,
        })

        if (res.status === 200) {
          message.success("Item Added Successfully!")
          getAllItems()
          setPopModal(false)
          setImageFile(null)
          setImagePreview("")
          setIngredients([])
          form.resetFields()
        } else {
          message.error("Failed to add item.")
        }
      } else {
        // Edit existing item
        await axios.put("/api/items/edit-item", {
          ...values,
          itemId: editItem._id,
          image: imageUrl,
          ingredients: ingredients,
        })

        message.success("Item Updated Successfully!")
        getAllItems()
        setPopModal(false)
        SetEdititem(null)
        setImageFile(null)
        setImagePreview("")
        setIngredients([])
        form.resetFields()
      }

      dispatch({ type: "HIDE_LOADING" })
    } catch (error) {
      message.error("Something Went Wrong!")
      console.error("Form submission error:", error)
      dispatch({ type: "HIDE_LOADING" })
    }
  }

  return (
    <>
      <SideBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Item List</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input.Search
            placeholder="Search items"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "250px",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              setPopModal(true)
              SetEdititem(null)
              setImageFile(null)
              setImagePreview("")
              setIngredients([])
              setSelectedCategory("")
              form.resetFields()
            }}
            style={{
              backgroundColor: "#800000",
              borderColor: "#800000",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Add Item
          </Button>
          <Button
            type="primary"
            onClick={generatePDF}
            style={{
              backgroundColor: "#006400",
              borderColor: "#006400",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <FaPrint />
            Report
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        bordered
        rowKey="_id"
        sticky
        scroll={{ y: 400 }}
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginLeft: "300px",
          marginRight: "20px",
          marginTop: "-20px",
        }}
      />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "Add new Item"}`}
          visible={popupModal}
          onCancel={() => {
            SetEdititem(null)
            setPopModal(false)
            setImageFile(null)
            setImagePreview("")
            setIngredients([])
            setSelectedCategory("")
            form.resetFields()
          }}
          footer={false}
          style={{ borderRadius: "8px" }}
          width={800}
        >
          <Form form={form} layout="vertical" initialValues={editItem} onFinish={handleSubmit}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter the item name" },
                    { min: 3, message: "Name must be at least 3 characters long" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select onChange={handleCategoryChange}>
                    <Select.Option value="foods">Foods</Select.Option>
                    <Select.Option value="alcoholicBeverages">Alcoholic Beverages</Select.Option>
                    <Select.Option value="beer">Beer</Select.Option>
                    <Select.Option value="wine">Wine</Select.Option>
                    <Select.Option value="nonAlcoholicBeverages">Non-Alcoholic Beverages</Select.Option>
                    <Select.Option value="cocktails">Cocktails</Select.Option>
                    <Select.Option value="juice">Juice</Select.Option>
                    <Select.Option value="tobacco">Tobacco</Select.Option>
                    <Select.Option value="snacks">Snacks</Select.Option>
                  </Select>
                </Form.Item>

                {/* Conditionally show Bottle Price and Shot Price fields */}
                {!isFoodCategory && (
                  <>
                    <Form.Item
                      name="Bprice"
                      label="Bottle Price"
                      rules={[
                        { required: true, message: "Please enter the bottle price" },
                        {
                          pattern: /^\d+(\.\d{1,2})?$/,
                          message: "Please enter a valid number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="Sprice"
                      label="Shot Price"
                      rules={[
                        { required: true, message: "Please enter the shot price" },
                        {
                          pattern: /^\d+(\.\d{1,2})?$/,
                          message: "Please enter a valid number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                )}

                {/* Hidden fields for foods category to store default values */}
                {isFoodCategory && (
                  <>
                    <Form.Item name="Bprice" hidden initialValue="0">
                      <Input />
                    </Form.Item>
                    <Form.Item name="Sprice" hidden initialValue="0">
                      <Input />
                    </Form.Item>
                  </>
                )}

                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    { required: true, message: "Please enter the price" },
                    {
                      pattern: /^\d+(\.\d{1,2})?$/,
                      message: "Please enter a valid number",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </div>

              <div style={{ flex: 1 }}>
                {/* Image Upload Section */}
                <Form.Item
                  name="image"
                  label="Image"
                  rules={[
                    {
                      required: !imageFile,
                      message: "Please upload an image or provide an image URL",
                    },
                  ]}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* Image Preview */}
                    {imagePreview && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            borderRadius: "4px",
                            border: "1px solid #d9d9d9",
                          }}
                          onError={(e) => {
                            console.error("Preview image failed to load:", imagePreview)
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/200x150?text=Image+Preview"
                          }}
                        />
                      </div>
                    )}

                    {/* File Input (hidden) */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />

                    {/* Upload Button */}
                    <Button
                      icon={<UploadOutlined />}
                      onClick={() => fileInputRef.current.click()}
                      style={{ marginBottom: "10px" }}
                    >
                      Upload Image
                    </Button>

                    {/* URL Input (as fallback) */}
                    <Input
                      placeholder="Or enter image URL"
                      value={form.getFieldValue("image")}
                      onChange={(e) => {
                        form.setFieldsValue({ image: e.target.value })
                        if (e.target.value) {
                          setImagePreview(e.target.value)
                        }
                      }}
                    />

                    <div style={{ fontSize: "12px", color: "#888" }}>
                      Supported formats: JPEG, PNG, GIF, WEBP (max 2MB)
                    </div>
                  </div>
                </Form.Item>

                {/* Ingredients Section */}
                <Divider orientation="left">Ingredients</Divider>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <Input
                        placeholder="Ingredient name"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        style={{ flex: 2 }}
                      />
                      <Input
                        placeholder="Price (optional)"
                        value={newIngredient.price}
                        onChange={(e) => setNewIngredient({ ...newIngredient, price: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <Button
                        type={newIngredient.isDefault ? "primary" : "default"}
                        onClick={() => setNewIngredient({ ...newIngredient, isDefault: !newIngredient.isDefault })}
                        style={{ width: "100px" }}
                      >
                        {newIngredient.isDefault ? "Default" : "Optional"}
                      </Button>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIngredient}>
                        Add
                      </Button>
                    </div>
                    <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                      Default ingredients are automatically selected for the customer
                    </div>
                  </div>

                  {ingredients.length > 0 ? (
                    <div
                      style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #f0f0f0", padding: "10px" }}
                    >
                      {ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px",
                            borderBottom: index < ingredients.length - 1 ? "1px solid #f0f0f0" : "none",
                          }}
                        >
                          <div>
                            <Tag color={ingredient.isDefault ? "green" : "blue"}>{ingredient.name}</Tag>
                            {ingredient.price && ingredient.price !== "0" && (
                              <span style={{ marginLeft: "8px", color: "#666" }}>
                                ${Number.parseFloat(ingredient.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Space>
                            <Button
                              type="text"
                              icon={ingredient.isDefault ? <MinusOutlined /> : <PlusOutlined />}
                              onClick={() => handleToggleDefault(index)}
                              size="small"
                            >
                              {ingredient.isDefault ? "Make Optional" : "Make Default"}
                            </Button>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveIngredient(index)}
                              size="small"
                            />
                          </Space>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        background: "#f9f9f9",
                        borderRadius: "4px",
                        color: "#999",
                      }}
                    >
                      No ingredients added yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button type="primary" htmlType="submit">
                {editItem ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setPopModal(false)
                  SetEdititem(null)
                  setImageFile(null)
                  setImagePreview("")
                  setIngredients([])
                  setSelectedCategory("")
                  form.resetFields()
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default ItemPage
