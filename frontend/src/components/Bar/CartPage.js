import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, message, Form, Input, Select } from "antd";
import SideBar from "../SideBar/BarSideBar";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Handle increment
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} width="50" height="50" />
      ),
    },
    {
      title: "Bprice",
      dataIndex: "Bprice",
    },
    {
      title: "Sprice",
      dataIndex: "Sprice",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  // Calculate subtotal
  useEffect(() => {
    let tempBprice = 0;
    let tempSprice = 0;
    let tempprice = 0;

    cartItems.forEach((item) => {
      tempBprice += (item.Bprice * item.quantity) || 0;
      tempSprice += (item.Sprice * item.quantity) || 0;
      tempprice += (item.price * item.quantity) || 0;
    });

    setSubTotal(tempBprice + tempSprice + tempprice);
  }, [cartItems]);

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      const newObject = {
        ...values,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
      };

      const response = await axios.post("/api/bills/add-bills", newObject);
      message.success("Bill Created Successfully!");
      navigate("/bills");
    } catch (error) {
      message.error("Something Went Wrong!");
    }
  };

  return (
    <>
    <SideBar/>
      <h1 style={{marginLeft:"260px"}}>Cart</h1>
      <Table columns={columns} dataSource={cartItems} bordered rowKey="_id" style={{marginLeft:"260px",marginRight:"20px"}}/>
      <div className="d-flex flex-column align-items-end" style={{marginLeft:"260px"}}>
        <hr />
        <h3>
          SUB TOTAL : LKR <b> {subTotal} </b> /-
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>

      <Modal
  title="Create Invoice"
  visible={billPopup}
  onCancel={() => setBillPopup(false)}
  footer={false}
>
  <Form layout="vertical" onFinish={handleSubmit}>
    <Form.Item
      name="customerName"
      label="Customer Name"
      rules={[
        { required: true, message: "Please enter the customer name" },
        { min: 3, message: "Customer name must be at least 3 characters" },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="customerNumber"
      label="Contact No"
      rules={[
        { required: true, message: "Please enter the contact number" },
        {
          pattern: /^\d{10}$/,
          message: "Contact number must be 10 digits",
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="paymentMode"
      label="Payment Method"
      rules={[{ required: true, message: "Please select a payment method" }]}
    >
      <Select>
        <Select.Option value="cash">Cash</Select.Option>
        <Select.Option value="card">Card</Select.Option>
      </Select>
    </Form.Item>

    {/* Display cart items in the invoice modal */}
    <div>
      <h4>Items:</h4>
      <Table
        dataSource={cartItems}
        columns={[
          {
            title: "Item Name",
            dataIndex: "name",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            title: "Price (LKR)",
            dataIndex: "price",
            render: (price, record) => (
           <div>
           {record.price > 0 && <div>LKR {record.price * record.quantity}</div>}
           {record.Bprice > 0 && <div>Bprice: LKR {record.Bprice * record.quantity}</div>}
           {record.Sprice > 0 && <div>Sprice: LKR {record.Sprice * record.quantity}</div>}
           </div>
           ),
          },
        ]}
        pagination={false}
        rowKey="_id"
      />
    </div>

    {/* Display subtotal, tax, and total */}
    <div className="bill-it">
      <h5>
        Sub Total: LKR <b>{subTotal}</b>
      </h5>
      <h4>
        TAX: LKR <b>{((subTotal / 100) * 10).toFixed(2)}</b>
      </h4>
      <h3>
        GRAND TOTAL: LKR{" "}
        <b>
          {Number(subTotal) +
            Number(((subTotal / 100) * 10).toFixed(2))}
        </b>
      </h3>
    </div>

    <div className="d-flex justify-content-end">
      <Button type="primary" htmlType="submit">
        Generate Bill
      </Button>
    </div>
  </Form>
</Modal>

      
    </>
  );
};

export default CartPage;
