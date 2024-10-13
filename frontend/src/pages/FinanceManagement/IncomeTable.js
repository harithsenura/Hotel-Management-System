import React, { useEffect, useState } from 'react';
import './IncomeTable.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaEdit, FaTrash, FaPlus, FaDownload } from 'react-icons/fa'; // Importing React Icons
import SideBar from '../../components/SideBar/FinanceSideBar';
import logo from '../../images/company.png'

const IncomeTable = () => {
  const navigate = useNavigate();
  const [statement, setStatement] = useState(null); // Holds the current statement

  useEffect(() => {
    fetchStatement();
  }, []);

  const fetchStatement = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finance/income'); // Fetch data from backend
      if (response.data.length > 0) {
        setStatement(response.data[0]); // Set only the first statement if exists
      }
    } catch (error) {
      console.error('Error fetching income statement:', error);
    }
  };

  const handleAdd = () => {
    navigate('/finance/incomeform'); // Navigate to the add form page
  };

  const handleUpdate = () => {
    navigate('/update', { state: { ...statement } }); // Navigate to the update page with statement data
  };

  const handleDelete = async () => {
    if (!statement) return; // Do nothing if no statement is set
    try {
      await axios.delete(`http://localhost:5000/finance/income/delete/${statement._id}`);
      alert('Income statement deleted successfully');
      setStatement(null); // Clear the statement
    } catch (error) {
      console.error('Error deleting income statement:', error);
      alert('Failed to delete income statement');
    }
  };

  const handleDownload = async () => {
    const input = document.getElementById('statement-table');
    if (!input) return; // If table is not found, return early
  
    const canvas = await html2canvas(input); // Create a canvas from the table
    const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
    const pdf = new jsPDF();
  
    // Add a border around the page
    pdf.rect(5, 5, pdf.internal.pageSize.width - 10, pdf.internal.pageSize.height - 10);
  
    // Add the imported company logo to the top left corner (10mm margin)
    pdf.addImage(logo, 'PNG', 10, 10, 25, 12); // Use the imported logo directly
  
    // Add company details below the logo
    const rightAlignText = (pdf, text, y) => {
      const pageWidth = pdf.internal.pageSize.width;
      const textWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const xPosition = pageWidth - textWidth - 10; // 10px margin from the right edge
      pdf.text(text, xPosition, y);
    };
  
    pdf.setFontSize(8);
    rightAlignText(pdf, 'Cinnamon Red Hotel', 12);
    rightAlignText(pdf, 'Email: contact@cinnamonred.com', 17);
    rightAlignText(pdf, 'Contact: +1 234 567 890', 23);
  
    // Add header for the financial statement
    pdf.setFontSize(20);
    pdf.text('Financial Statement', pdf.internal.pageSize.width / 2, 55, { align: 'center' });
  
    // Add the income statement table image
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 70; // Adjust position to add header spacing before the table
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  
    // Add a border around the image with rounded corners and grey color
    pdf.setDrawColor(169, 169, 169); // Set grey color (RGB)
    pdf.setFillColor(255, 255, 255); // Set fill color to white for rounded corner background
    pdf.roundedRect(10, position - 5, imgWidth, imgHeight + 10, 5, 5); // 5px radius for rounded corners
  
    // Add a thank you note at the bottom center of the page
    const thankYouMessage = 'Thank you for doing business with us!';
    const thankYouWidth = pdf.getStringUnitWidth(thankYouMessage) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const xPosition = (pdf.internal.pageSize.width) / 2;
  
    // Set a smaller font size for the thank you message and adjust its position
    pdf.setFontSize(8); // Small font size for "Thank You"
    const yPosition = pageHeight - 20; // Adjust the position for better placement
    pdf.text(thankYouMessage, xPosition-25, yPosition); // Fixed to the bottom center
  
    // Save the generated PDF
    pdf.save('Income_Statement.pdf');
  };
  
  
  
  
  

  // Function to calculate the totals
  const calculateTotal = () => {
    if (!statement) return { totalCosts: 0, totalProfits: 0, netTotal: 0 };
    const totalCosts = Number(statement.costofsales) + Number(statement.deliverycost) + Number(statement.administrativecost) + Number(statement.otherexpences) + Number(statement.financeexpences);
    const totalProfits = Number(statement.sales) + Number(statement.otherincomes) + Number(statement.grossprofit) + Number(statement.netprofit);
    const netTotal = totalProfits - totalCosts;
    return { totalCosts, totalProfits, netTotal };
  };

  const totals = calculateTotal();

  return (
    <>
      <SideBar />
      <div className="income-table-container">
      <h2 className="statement-header">Income and Expenditure Statement</h2>
        <div className="statement-buttons">
          {!statement && (
            <button className="button add-btn" onClick={handleAdd}>
              <FaPlus style={{ marginRight: '8px' }} /> Add
            </button>
          )}
          {statement && (
            <>
              <button className="button update-btn" onClick={handleUpdate}>
                <FaEdit style={{ marginRight: '8px' }} /> Update
              </button>
              <div className="action-buttons">
                <button className="button delete-btn" onClick={handleDelete}>
                  <FaTrash style={{ marginRight: '8px' }} /> Delete
                </button>
                <button className="button download-btn" onClick={handleDownload}>
                  <FaDownload style={{ marginRight: '8px' }} /> Download PDF
                </button>
              </div>
            </>
          )}
        </div> <br/>
      
        {statement ? (
          <div className="statement-content">
            <table id="statement-table" className="income-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="description">Sales</td>
                  <td></td>
                  <td className="amount">{statement.sales}</td>
                </tr>
                <tr>
                  <td className="description">Cost of Sales</td>
                  <td className="amount">({statement.costofsales})</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description bold-text">Gross Profit</td>
                  <td></td>
                  <td className="amount bold-text">{statement.grossprofit}</td>
                </tr>
                <tr>
                  <td className="description">Other Incomes</td>
                  <td></td>
                  <td className="amount">{statement.otherincomes}</td>
                </tr>
                <tr>
                  <td className="description">Delivery Costs</td>
                  <td className="amount">({statement.deliverycost})</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Administrative Expenses</td>
                  <td className="amount">({statement.administrativecost})</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Other Expenses</td>
                  <td className="amount">({statement.otherexpences})</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description">Financial Expenses</td>
                  <td className="amount">({statement.financeexpences})</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="description bold-text">Net Profit</td>
                  <td></td>
                  <td className="amount bold-text">{statement.netprofit}</td>
                </tr>
                <tr className="total-row bold-text">
                  <td>Total</td>
                  <td className="amount">({totals.totalCosts})</td>
                  <td className="amount">{totals.totalProfits}</td>
                </tr>
                <tr className="net-total-row bold-text">
                  <td>Net Total(Rs)</td>
                  <td></td>
                  <td className="amount">{totals.netTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data available. Please enter information to display the income and expenditure statement.</p>
        )}
      </div>
    </>
  );
};

export default IncomeTable;
