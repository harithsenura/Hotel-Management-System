"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FaEdit, FaTrash, FaSearch, FaFilePdf, FaUserTie, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"
import "jspdf-autotable"
import logo from "../../images/company.png"
import SideBar from "../../components/SideBar/EventSidebar"

export default function PlannerList() {
  const [planners, setPlanners] = useState([])
  const [filteredPlanners, setFilteredPlanners] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("") // success or error
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmDialogData, setConfirmDialogData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // CSS Keyframes animations
  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    @keyframes slideIn {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `

  useEffect(() => {
    // Fetch event planners data
    setIsLoading(true)
    axios
      .get("http://localhost:5001/eventplanners/")
      .then((res) => {
        setTimeout(() => {
          // Simulate loading for demo purposes
          setPlanners(res.data.data)
          setFilteredPlanners(res.data.data)
          setIsLoading(false)
        }, 1000)
      })
      .catch((err) => {
        showAlertMessage("Error loading planners data", "error")
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    // Filter the planners list based on the search term
    const filtered = planners.filter(
      (planner) =>
        planner.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planner.AssignedEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planner.ContactNumber.includes(searchTerm),
    )
    setFilteredPlanners(filtered)
  }, [searchTerm, planners])

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleDeleteClick = (planner) => {
    setConfirmDialogData(planner)
    setShowConfirmDialog(true)
  }

  const handleDelete = () => {
    if (confirmDialogData) {
      setIsLoading(true)
      axios
        .delete(`http://localhost:5001/eventplanners/${confirmDialogData._id}`)
        .then(() => {
          showAlertMessage("Event Planner deleted successfully!")
          setPlanners(planners.filter((planner) => planner._id !== confirmDialogData._id))
          setFilteredPlanners(filteredPlanners.filter((planner) => planner._id !== confirmDialogData._id))
          setIsLoading(false)
        })
        .catch(() => {
          showAlertMessage("Error deleting event planner.", "error")
          setIsLoading(false)
        })
      setShowConfirmDialog(false)
    }
  }

  const generateReport = () => {
    const doc = new jsPDF()

    doc.addImage(logo, "PNG", 10, 10, 25, 13)

    doc.setFontSize(8)
    doc.setTextColor(0)
    doc.text("Cinnomon Red Colombo", 10, 30)
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35)
    doc.text("Contact: (123) 456-7890", 10, 40)
    doc.text("Email: info@cinnomred.com", 10, 45)

    doc.setFontSize(18)
    const headingY = 60
    doc.text("Event Planners Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" })

    const headingWidth = doc.getTextWidth("Event Planners Report")
    const underlineY = headingY + 1
    doc.setDrawColor(0)
    doc.line(
      doc.internal.pageSize.getWidth() / 2 - headingWidth / 2,
      underlineY,
      doc.internal.pageSize.getWidth() / 2 + headingWidth / 2,
      underlineY,
    )

    const columns = ["Name", "Assigned Event", "Salary For Event", "Email", "Contact Number"]
    const rows = filteredPlanners.map((planner) => [
      planner.Name,
      planner.AssignedEvent,
      planner.SalaryForTheEvent,
      planner.Email,
      planner.ContactNumber,
    ])

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 80,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [128, 0, 0], // Dark red header
        textColor: [255, 255, 255], // White text
      },
      alternateRowStyles: {
        fillColor: [249, 249, 249], // Light gray for alternate rows
      },
    })

    const endingY = doc.internal.pageSize.getHeight() - 30
    doc.setFontSize(10)
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" })
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" })

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10)

    doc.save("event_planners_report.pdf")

    showAlertMessage("Report generated successfully!")
  }

  // Loading skeletons for table rows
  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item} className="skeleton-row">
          <td className="skeleton-cell"></td>
          <td className="skeleton-cell"></td>
          <td className="skeleton-cell"></td>
          <td className="skeleton-cell"></td>
          <td className="skeleton-cell"></td>
          <td className="skeleton-cell skeleton-action"></td>
          <td className="skeleton-cell skeleton-action"></td>
        </tr>
      ))}
    </>
  )

  return (
    <div className="planner-list-container">
      <style>
        {`
          ${keyframes}
          
          .planner-list-container {
            display: flex;
            min-height: 100vh;
            background-color: #f8fafc;
            font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .content-area {
            flex: 1;
            padding: 20px;
            margin-left: 250px;
            transition: margin-left 0.3s;
          }
          
          @media (max-width: 768px) {
            .content-area {
              margin-left: 0;
              padding: 15px;
            }
          }
          
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            position: relative;
            animation: fadeIn 0.8s ease forwards;
          }
          
          .header h1 {
            color: #0066ff;
            font-size: 28px;
            margin: 0;
            font-weight: 600;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, #0066ff, #00ccff);
          }
          
          .search-bar {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            animation: fadeIn 0.8s ease forwards;
            animation-delay: 0.2s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          
          .search-input {
            flex: 1;
            padding: 12px 20px 12px 50px;
            border-radius: 50px;
            border: 1px solid #ddd;
            font-size: 14px;
            transition: all 0.3s;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            max-width: 400px;
            position: relative;
          }
          
          .search-input:focus {
            border-color: #0066ff;
            box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
            outline: none;
          }
          
          .search-icon {
            position: absolute;
            left: 20px;
            color: #0066ff;
            font-size: 18px;
          }
          
          .report-button {
            background: linear-gradient(45deg, #0066ff, #00ccff);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0, 102, 255, 0.2);
            margin-left: 15px;
          }
          
          .report-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 102, 255, 0.3);
          }
          
          .report-button:active {
            transform: translateY(0);
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            margin-bottom: 30px;
            animation: fadeIn 0.8s ease forwards;
            animation-delay: 0.4s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            overflow: hidden;
          }
          
          th {
            background-color: #0066ff;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          
          thead tr {
            height: 60px;
          }
          
          tbody tr {
            transition: all 0.2s;
            animation: slideIn 0.5s ease forwards;
            opacity: 0;
            border-bottom: 1px solid #f1f5f9;
          }
          
          tbody tr:hover {
            background-color: #f8fafc;
            transform: translateX(5px);
          }
          
          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }
          
          td {
            padding: 15px;
            position: relative;
          }
          
          .action-button {
            padding: 8px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            color: white;
            width: 36px;
            height: 36px;
          }
          
          .edit-button {
            background-color: #00cc66;
            margin-right: 8px;
          }
          
          .edit-button:hover {
            background-color: #00aa55;
            transform: scale(1.1);
          }
          
          .delete-button {
            background-color: #ff3366;
          }
          
          .delete-button:hover {
            background-color: #e60040;
            transform: scale(1.1);
          }
          
          .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            min-width: 300px;
          }
          
          .alert-success {
            background-color: #00cc66;
          }
          
          .alert-error {
            background-color: #ff3366;
          }
          
          .confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          
          .confirm-dialog {
            background: white;
            padding: 30px;
            border-radius: 16px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            text-align: center;
          }
          
          .confirm-dialog h2 {
            margin: 0 0 20px;
            color: #ff3366;
            font-size: 24px;
          }
          
          .confirm-dialog p {
            margin: 0 0 25px;
            font-size: 16px;
            color: #475569;
            line-height: 1.6;
          }
          
          .confirm-dialog-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          
          .confirm-button {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .confirm-delete {
            background-color: #ff3366;
            color: white;
            border: none;
          }
          
          .confirm-delete:hover {
            background-color: #e60040;
          }
          
          .confirm-cancel {
            background-color: white;
            color: #64748b;
            border: 1px solid #cbd5e1;
          }
          
          .confirm-cancel:hover {
            background-color: #f8fafc;
          }
          
          .empty-message {
            text-align: center;
            padding: 40px;
            color: #64748b;
            font-size: 16px;
          }
          
          .planner-name {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .planner-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background-color: #e0f2fe;
            color: #0066ff;
            border-radius: 50%;
            font-size: 16px;
          }
          
          .skeleton-row {
            animation: fadeIn 1s infinite alternate;
          }
          
          .skeleton-cell {
            padding: 15px;
            position: relative;
            height: 30px;
            border-radius: 4px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          
          .skeleton-action {
            width: 36px;
            height: 36px;
            border-radius: 8px;
          }
          
          .loading-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #0066ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @media (max-width: 992px) {
            th, td {
              padding: 10px;
            }
            
            .action-button {
              width: 32px;
              height: 32px;
            }
          }
          
          @media (max-width: 768px) {
            .search-bar {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }
            
            .search-input {
              width: 100%;
              max-width: none;
            }
            
            .report-button {
              margin-left: 0;
            }
            
            table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
            }
          }
          
          @media (max-width: 576px) {
            .header h1 {
              font-size: 24px;
            }
            
            .confirm-dialog {
              padding: 20px;
            }
          }
        `}
      </style>

      <SideBar />

      <div className="content-area">
        <div className="header">
          <h1>All Event Planners</h1>
        </div>

        <div className="search-bar">
          <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, event or contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button onClick={generateReport} className="report-button">
            <FaFilePdf /> Generate Report
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Assigned Event</th>
                <th>Salary</th>
                <th>Email</th>
                <th>Contact</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredPlanners.length > 0 ? (
                filteredPlanners.map((planner, index) => (
                  <tr key={planner._id} style={{ animationDelay: `${0.1 * index}s` }}>
                    <td>
                      <div className="planner-name">
                        <div className="planner-icon">
                          <FaUserTie />
                        </div>
                        {planner.Name}
                      </div>
                    </td>
                    <td>{planner.AssignedEvent}</td>
                    <td>{planner.SalaryForTheEvent}</td>
                    <td>{planner.Email}</td>
                    <td>{planner.ContactNumber}</td>
                    <td>
                      <Link to={`/planner/${planner._id}`}>
                        <button className="action-button edit-button">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button className="action-button delete-button" onClick={() => handleDeleteClick(planner)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No Event Planners Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            >
              {alertType === "error" ? <FaTimes /> : "✓"}
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              className="confirm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="confirm-dialog"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <h2>Confirm Deletion</h2>
                <p>
                  Are you sure you want to delete the event planner
                  <strong> {confirmDialogData?.Name}</strong>? This action cannot be undone.
                </p>
                <div className="confirm-dialog-buttons">
                  <button onClick={handleDelete} className="confirm-button confirm-delete">
                    Delete
                  </button>
                  <button onClick={() => setShowConfirmDialog(false)} className="confirm-button confirm-cancel">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

