import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UpdateItems from "../InventoryManagement/UpdateItems"; // Ensure the path is correct
import logo from "../images/company.png"
import SideBar from "../../components/SideBar/InventoryManagementSidebar";

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this item?</p>
          <div style={buttonContainerStyle}>
            <button onClick={onConfirm} style={confirmButtonStyle}>
              Yes, Delete
            </button>
            <button onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for the modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const buttonContainerStyle = {
  marginTop: '20px',
};

const confirmButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '10px',
};

const cancelButtonStyle = {
  backgroundColor: '#ccc',
  color: '#000',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default function StockManage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // ID of the item to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/stocks`);
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to fetch items: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const editItem = (item) => {
    navigate(`/update-items/${item}`);
    setSelectedItem(item);
    setShowUpdateForm(true);
  };

  const handleSave = async (updatedItem) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/inventory/stocks/${updatedItem.id}`, updatedItem);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemIdToDelete(itemId); // Set the item ID to delete
    setIsModalOpen(true); // Open the modal
  };
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/stocks`);
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to fetch items: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      console.log("Attempting to delete item with ID:", itemIdToDelete); // Debugging log
      await axios.delete(`http://localhost:5000/api/inventory/stocks/${itemIdToDelete}`);
      alert("Item deleted successfully."); // Success message
      fetchItems(); // Refetch items after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false); // Close the modal after deletion
    }
  };
  

  const filteredItems = items.filter(
    (item) =>
      (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generateReport = () => {
    const doc = new jsPDF();

    // Add logo image (if available)
    doc.addImage(logo, "PNG", 10, 10, 25, 13); // Adjust the dimensions as necessary

    // Add company details below the logo
    doc.setFontSize(8);
    doc.setTextColor(0); // Set a lighter color for professionalism
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@cinnomred.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0); // Reset text color to black
    const headingY = 60; // Adjusted position for heading
    doc.text("Stock Management Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Stock Management Report"); // Calculate the width of the heading
    const underlineY = headingY + 1; // Position for underline
    doc.setDrawColor(0); // Set color for the underline
    doc.line(
      (doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2),
      underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2),
      underlineY
    ); // Draw line

    // Add a line break
    doc.setFontSize(12);
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

    // Define table columns and rows
    const columns = ["Item Name", "Category", "In Stock", "Date", "Status"];
    const rows = filteredItems.map(item => [
      item.itemName,
      item.category,
      item.inStock,
      item.date,
      item.statusOfItem,
    ]);

    // Add the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 80, // Start position after the logo and company details
    });

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30; // Fix position for ending at the bottom
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });

    // Add contact number sample below the thank you message
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw a border with 5 unit padding

    // Save the PDF
    doc.save("stock_report.pdf");
  };


  return (
    <>
      <SideBar/>
      <div>
        <h1 style={{ textAlign: "center", marginLeft: "250px", marginTop: "50px", fontSize: 32 }}>
          Manage Stock Items
        </h1>
      </div>
      <div style={containerStyle}>
        {loading ? (
          <p>Loading...</p>
        ) : showUpdateForm ? (
          <UpdateItems
            item={selectedItem}
            onSave={handleSave}
            onClose={() => setShowUpdateForm(false)}
          />
        ) : (
          <div style={tableWrapperStyle}>
            <div style={searchWrapperStyle}>
              <input
                type="text"
                placeholder="Search by Item Name or Category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
              <FaSearch style={{ marginTop: "10px", marginLeft: "10px" }} />
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Item Name</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>In Stock</th>
                  <th style={headerStyle}>Date</th>
                  <th style={headerStyle}>Status</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={cellStyle}>{item.itemName}</td>
                    <td style={cellStyle}>{item.category}</td>
                    <td style={cellStyle}>{item.inStock}</td>
                    <td style={cellStyle}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={cellStyle}>{item.statusOfItem}</td>
                    <td style={cellStyle}>
                      <button style={buttonStyle} onClick={() => editItem(item._id)}>
                        <FaEdit />
                      </button>
                      <button style={deleteButtonStyle} onClick={() => openDeleteModal(item._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={generateButtonWrapperStyle}>
              <button onClick={generateReport} style={generateReportButtonStyle}>
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

// Styles for the components
const containerStyle = {
  padding: "20px",
  boxSizing: "border-box",
  marginLeft: "250px",
  marginRight: "10px",
};

const tableWrapperStyle = {
  marginTop: "20px",
};

const searchWrapperStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};

const searchInputStyle = {
  padding: "10px",
  fontSize: "14px",
  width: "300px",
  marginLeft: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const tableStyle = {
  width: "100%",
};

const headerStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  padding: "10px",
};

const cellStyle = {
  padding: "10px",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  marginRight: "5px",
};

const deleteButtonStyle = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
};

const generateButtonWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const generateReportButtonStyle = {
  backgroundColor: "#800000",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};
