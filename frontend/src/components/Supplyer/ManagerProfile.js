import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Input, message } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SupplyerHeader from "./SupplyerHeader"; // Ensure the path is correct
import logo from '../../images/company.png';
import SideBar from "../SideBar/SupplySideBar";

const ManagerProfile = () => {
  const [managers, setManagers] = useState([]); // State to hold all managers
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null); // State for the manager to be edited
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [errors, setErrors] = useState({}); // State for form validation errors

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/managers/Get`);
        setManagers(response.data.data); // Assuming response data has the data property
      } catch (err) {
        setError(err.message);
      }
    };

    fetchManagers();
  }, []);

  const validate = (managerData) => {
    let tempErrors = {};

    // Validate Manager ID
    if (!managerData.managerId) {
      tempErrors.managerId = "Manager ID is required";
    } else if (managerData.managerId.length < 5 || managerData.managerId.length > 10) {
      tempErrors.managerId = "Manager ID must be between 5 and 10 characters";
    }

    // Validate Manager Name
    if (!managerData.managerName) {
      tempErrors.managerName = "Manager name is required";
    } else if (managerData.managerName.length < 2 || managerData.managerName.length > 50) {
      tempErrors.managerName = "Manager name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(managerData.managerName)) {
      tempErrors.managerName = "Manager name can only contain letters and spaces";
    }

    // Validate Role
    const validRoles = ["Admin", "Supervisor", "Team Lead", "Manager"]; // Example roles
    if (!managerData.role) {
      tempErrors.role = "Role is required";
    } else if (!validRoles.includes(managerData.role)) {
      tempErrors.role = "Role must be one of: " + validRoles.join(", ");
    }

    // Validate Department
    const validDepartments = ["HR", "Engineering", "Sales", "Marketing"]; // Example departments
    if (!managerData.department) {
      tempErrors.department = "Department is required";
    } else if (!validDepartments.includes(managerData.department)) {
      tempErrors.department = "Department must be one of: " + validDepartments.join(", ");
    }

    // Validate Contact Number
    if (!managerData.contactNo) {
      tempErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(managerData.contactNo)) { // Assuming a 10-digit contact number
      tempErrors.contactNo = "Contact number must be a 10-digit number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async (values) => {
    if (!validate(values)) {
      return; // Stop if validation fails
    }

    try {
      await axios.put(`http://localhost:5000/api/managers/Update/${editItem.managerId}`, values);
      message.success("Manager updated successfully!");
      setModalVisible(false);
      setEditItem(null);
      // Refresh managers list
      const response = await axios.get(`http://localhost:5000/api/managers/Get`);
      setManagers(response.data.data);
    } catch (error) {
      message.error("Failed to update manager.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (managerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/managers/Delete/${managerId}`);
      message.success("Manager deleted successfully!");
      // Refresh managers list
      const response = await axios.get(`http://localhost:5000/api/managers/Get`);
      setManagers(response.data.data);
    } catch (error) {
      message.error("Failed to delete manager.");
      console.error("Delete error:", error);
    }
  };

  const openEditModal = (manager) => {
    setEditItem(manager);
    setModalVisible(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 150, 10, 25, 13);
    // Add company details (customize as needed)
    doc.setFontSize(10);
    doc.text("Your Company Name", 10, 10);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 15);
    doc.text("Contact: (123) 456-7890", 10, 20);
    doc.text("Email: info@yourcompany.com", 10, 25);
    doc.setFontSize(18);
    doc.text("Managers List", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Define table columns
    const headers = ["Manager ID", "Manager Name", "Role", "Department", "Contact No"];

    // Map data for the table
    const data = managers.map(manager => [
      manager.managerId,
      manager.managerName,
      manager.role,
      manager.department,
      manager.contactNo
    ]);

    // Add table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      styles: {
        fontSize: 10,
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
    doc.save("managers_report.pdf");
  };

  if (error) return <div>Error: {error}</div>;
  if (!managers.length) return <div>Loading...</div>;

  // Updated filtering logic
  const filteredManagers = managers.filter((manager) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      manager.managerName.toLowerCase().includes(searchTermLower) ||
      manager.role.toLowerCase().includes(searchTermLower) ||
      manager.department.toLowerCase().includes(searchTermLower) ||
      manager.contactNo.toString().includes(searchTermLower)
    );
  });

  return (
    <><SideBar/>
    <div style={containerStyle}>
     
      <h1 style={headerStyle}>Managers List</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={generatePDF}>
          Generate PDF
        </Button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Manager ID</th>
            <th style={tableHeaderStyle}>Manager Name</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Department</th>
            <th style={tableHeaderStyle}>Contact No</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No Data</td>
            </tr>
          ) : (
            filteredManagers.map((manager) => (
              <tr key={manager.managerId}>
                <td style={tableDataStyle}>{manager.managerId}</td>
                <td style={tableDataStyle}>{manager.managerName}</td>
                <td style={tableDataStyle}>{manager.role}</td>
                <td style={tableDataStyle}>{manager.department}</td>
                <td style={tableDataStyle}>{manager.contactNo}</td>
                <td style={tableDataStyle}>
                  <div style={buttonContainerStyle}>
                    <Button type="primary" onClick={() => openEditModal(manager)}>
                      Update
                    </Button>
                    <Button type="danger" style={{ backgroundColor: "red", color:"white"}} onClick={() => handleDelete(manager.managerId)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalVisible && (
        <Modal
          title="Edit Manager"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={editItem}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item
              name="managerId"
              label="Manager ID"
              validateStatus={errors.managerId ? "error" : ""}
              help={errors.managerId}
              rules={[{ required: true, message: "Please enter the manager ID!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="managerName"
              label="Manager Name"
              validateStatus={errors.managerName ? "error" : ""}
              help={errors.managerName}
              rules={[{ required: true, message: "Please enter the manager name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              validateStatus={errors.role ? "error" : ""}
              help={errors.role}
              rules={[{ required: true, message: "Please enter Your role" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              validateStatus={errors.department ? "error" : ""}
              help={errors.department}
              rules={[{ required: true, message: "Please enter the manager Department!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contactNo"
              label="Contact No"
              validateStatus={errors.contactNo ? "error" : ""}
              help={errors.contactNo}
              rules={[{ required: true, message: "Please enter the contact number!" }]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setModalVisible(false)} style={{ marginLeft: "10px" }}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      </div>
      </>
  );
};

// Styles
const containerStyle = {
  padding: "20px",
  width: "calc(100% - 260px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  marginLeft: "260px",
};

const headerStyle = {
  fontSize: "24px",
  textAlign: "left",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const tableHeaderStyle = {
  border: "1px solid #dddddd",
  backgroundColor: "#f2f2f2",
  padding: "8px",
  textAlign: "left",
};

const tableDataStyle = {
  border: "1px solid #dddddd",
  padding: "8px",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "10px",
};

export default ManagerProfile;
