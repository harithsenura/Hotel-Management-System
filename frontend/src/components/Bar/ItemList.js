import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
    const dispatch = useDispatch();

    // Update cart handler
    const handleAddToCart = () => {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...item, quantity: 1 },
        });
    };

    const { Meta } = Card;

    // Define styles for the card and button
    const cardStyle = {
        width: 250,
        marginBottom: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    };

    const buttonStyle = {
        width: 150,
        backgroundColor: "#800000",  // Set button background color to #800000
        color: "#fff",
        border: "none",
        marginTop: "10px",
        marginLeft: "25px",
    };

    // Styles for hover effect
    const hoverStyle = {
        transform: "scale(1.05)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    };

    return (
        <div>
            <Card
                style={cardStyle}
                cover={<img alt={item.name} src={item.image} style={{ height: 250 }} />}
                className="item-card"
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = hoverStyle.transform;
                    e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                }}
            >
                <Meta title={item.name} />

                {/* Display prices if they are greater than zero */}
                <div style={{ margin: "10px 0", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
                    {item.price > 0 && <div>LKR {item.price}</div>}
                    {item.Bprice > 0 && <div>Bprice: LKR {item.Bprice}</div>}
                    {item.Sprice > 0 && <div>Sprice: LKR {item.Sprice}</div>}
                </div>

                <p style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>{item.description}</p>
                <div className="item-button">
                    <Button
                        style={buttonStyle}
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ItemList;
