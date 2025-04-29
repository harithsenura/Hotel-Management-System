import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
import { jsPDF } from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas
import logo from '../../images/company.png';
import SideBar from "../SideBar/BarSideBar";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopModal] = useState(false);
  const [editItem, SetEdititem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  // Function to fetch items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete(`/api/items/delete-item/${record._id}`);
      message.success("Item Deleted Successfully!");
      getAllItems(); // Refresh items list
      setPopModal(false); // Close modal
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
      message.error("Something Went Wrong!");
    }
  };

  // Filtered data based on search term
  const filteredItems = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())||
    item.Bprice.toLowerCase().includes(searchTerm.toLowerCase()) || // Convert Bprice to string for search
    item.Sprice.toLowerCase().includes(searchTerm.toLowerCase()) // Convert Sprice to string for search
  );

 // Function to generate PDF
const generatePDF = async () => {
  const doc = new jsPDF();

  // Add company logo
  doc.addImage(logo, "PNG", 10, 10, 25, 13); // Ensure to import logo at the top

  // Add company details below the logo
  doc.setFontSize(8);
  doc.setTextColor(0);
  doc.text("Your Company Name", 10, 30);
  doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
  doc.text("Contact: (123) 456-7890", 10, 40);
  doc.text("Email: info@yourcompany.com", 10, 45);

  // Add centered heading
  doc.setFontSize(18);
  doc.setTextColor(0);
  const headingY = 60;
  doc.text("Item Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

  // Draw underline for heading
  const headingWidth = doc.getTextWidth("Item Management");
  const underlineY = headingY + 1;
  doc.setDrawColor(0);
  doc.line(
    (doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2),
    underlineY,
    (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2),
    underlineY
  );

  // Add line break
  doc.setFontSize(12);
  doc.text("Item List", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

  // Define table columns and rows
  const headers = [
    "No","Name", "Bottle Price", "Shot Price", "Price"
  ];

  const data = filteredItems.map((item, index) => [
    index + 1,
    item.name,
    `$${item.Bprice}`,
    `$${item.Sprice}`,
    `$${item.price}`
  ]);

  // Add the table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 80, 
    styles: {
      fontSize: 8,
    },
  });

  // Add a professional ending
  const endingY = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(10);
  doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
  doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

  // Draw page border
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // Save the PDF
  doc.save("items_report.pdf");
};


  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} width="50" height="50" style={{ borderRadius: "8px" }} />
      ),
    },
    {
      title: "Bottle Price",
      dataIndex: "Bprice",
    },
    {
      title: "Shot Price",
      dataIndex: "Sprice",
    },
    {
      title: "Price", // Ensure price is displayed here
      dataIndex: "price",
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              SetEdititem(record);
              setPopModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // Handle form submit for adding/editing items
  const handleSubmit = async (values) => {
    if (editItem === null) {
      // Add new item
      try {
        dispatch({ type: "SHOW_LOADING" });
        const res = await axios.post("/api/items/add-item", values);
        if (res.status === 200) {
          message.success("Item Added Successfully!");
          getAllItems(); // Refresh items list
          setPopModal(false); // Close modal
        } else {
          message.error("Failed to add item.");
        }
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        message.error("Something Went Wrong!");
        console.error("Form submission error:", error);
        dispatch({ type: "HIDE_LOADING" });
      }
    } else {
      // Edit existing item
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...values,
          itemId: editItem._id,
        });

        message.success("Item Updated Successfully!");
        getAllItems(); // Refresh items list
        setPopModal(false); // Close modal
        SetEdititem(null); // Clear edit state
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        message.error("Something Went Wrong!");
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    }
  };

  return (
    <>
    <SideBar/>
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
            onClick={() => setPopModal(true)}
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
            onClick={generatePDF} // Call generatePDF on button click
            style={{
              backgroundColor: "#006400",
              borderColor: "#006400",
              borderRadius: "5px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <FaPrint/>Report
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        bordered
        rowKey="_id"
        sticky
        scroll={{ y: 400 }} // Set the scroll height for the table content
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginLeft: "300px",
          marginRight: "20px",
          marginTop:"-20px"
        }}
      />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "Add new Item"}`}
          visible={popupModal}
          onCancel={() => {
            SetEdititem(null);
            setPopModal(false);
          }}
          footer={false} // Remove default footer buttons
          style={{ borderRadius: "8px" }}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
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

            <Form.Item
              name="image"
              label="Image URL"
              rules={[
                { required: true, message: "Please enter the image URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                <Select.Option value="alcoholicBeverages">
                  Alcoholic Beverages
                </Select.Option>
                <Select.Option value="beer">Beer</Select.Option>
                <Select.Option value="wine">Wine</Select.Option>
                <Select.Option value="nonAlcoholicBeverages">
                  Non-Alcoholic Beverages
                </Select.Option>
                <Select.Option value="cocktails">Cocktails</Select.Option>
                <Select.Option value="juice">Juice</Select.Option>
                <Select.Option value="tobacco">Tobacco</Select.Option>
                <Select.Option value="snacks">Snacks</Select.Option>
              </Select>
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button type="primary" htmlType="submit">
                {editItem ? "Update" : "Add"}
              </Button>
              <Button onClick={() => setPopModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal>
      )}
      
      </>
  );
};

export default ItemPage;
