import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/orderItemsList';
import Map from '../../components/Map/Map';
import PaypalButtons from '../../components/PaypalButtons/PaypalButtons';

export default function PaymentPage() {
    const [order, setOrder] = useState();

    useEffect(() => {
        getNewOrderForCurrentUser().then(data => setOrder(data));
    }, []);

    if (!order) return;

    const generatePDF = () => {
        const pdf = new jsPDF();

        // Add the company logo (Top left corner)
        const img = new Image();
        img.src = '/images/company.png';

        img.onload = () => {
            // Add company logo
            pdf.addImage(img, 'PNG', 10, 10, 50, 20); // (image, format, x, y, width, height)



            // Add heading "Bill Summary" (Center)
            pdf.setFontSize(22);
            pdf.text('Bill Summary', 105, 60, { align: 'center' });

            // Add order information
            pdf.setFontSize(16);
            pdf.text('Customer Details:', 10, 80);
            pdf.setFontSize(12);
            pdf.text(`Name: ${order.name}`, 10, 90);
            pdf.text(`Address: ${order.address}`, 10, 100);

            // Add a table for order items
            pdf.setFontSize(16);
            pdf.text('Order Items:', 10, 120);

            // Table header
            pdf.setFontSize(12);
            pdf.text('No', 10, 130);
            pdf.text('Item', 30, 130);
            pdf.text('Qty', 120, 130);
            pdf.text('Price', 150, 130);
            pdf.text('Total', 180, 130);

            // Add order items
            let yPosition = 140;
            order.items.forEach((item, index) => {
                pdf.text(`${index + 1}`, 10, yPosition);
                pdf.text(`${item.food.name}`, 30, yPosition);  // Ensure that order.items contains correct data
                pdf.text(`${item.quantity}`, 120, yPosition);
                pdf.text(`$${item.price.toFixed(2)}`, 150, yPosition);
                pdf.text(`$${(item.quantity * item.price).toFixed(2)}`, 180, yPosition);
                yPosition += 10;  // Move to the next row
            });

            // Add footer (Centered)
            pdf.setFontSize(10);
            pdf.text('Thank you for shopping with us!', 105, 270, { align: 'center' });
            pdf.text('www.companywebsite.com', 105, 280, { align: 'center' });

            // Add page border
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, 200, 287);  // Draw a border around the page

            // Save the PDF
            pdf.save('OrderBill.pdf');
        };
    };


    return (
        <>
            <div className={classes.container}>
                <div className={classes.content}>
                    <Title title="Order Form" fontSize="1.6rem" />
                    <div className={classes.summary}>
                        <div>
                            <h3>Name:</h3>
                            <span>{order.name}</span>
                        </div>
                        <div>
                            <h3>Address:</h3>
                            <span>{order.address}</span>
                        </div>
                    </div>
                    <OrderItemsList order={order} />
                </div>

                <div className={classes.map}>
                    <Title title="Your Location" fontSize="1.6rem" />
                    <Map readonly={true} location={order.addressLatLng} />
                </div>

                <div className={classes.buttons_container}>
                    <div className={classes.buttons}>
                        <PaypalButtons order={order} />
                        <button onClick={generatePDF}
                            style={{
                                backgroundColor: '#4CAF50',  // Green background
                                color: 'white',              // White text
                                padding: '10px 20px',        // Padding around the text
                                fontSize: '16px',            // Slightly larger font size
                                border: 'none',              // Remove border
                                borderRadius: '5px',         // Rounded corners
                                cursor: 'pointer',           // Pointer cursor on hover
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Soft shadow
                                transition: 'background-color 0.3s ease',  // Smooth background change on hover
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}  // Darken the button on hover
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}   // Revert back when not hovered
                        >
                            Summary Bill
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}
