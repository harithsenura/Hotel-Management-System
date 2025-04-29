import React, { useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import classes from './ordersPage.module.css';
import Title from '../../components/Title/Title';
import DateTime from '../../components/DateTime/DateTime';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';

const initialState = {};
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ORDERS_FETCHED':
            return { ...state, orders: payload };
        default:
            return state;
    }
};

export default function OrdersPage() {
    const [{ orders }, dispatch] = useReducer(reducer, initialState);
    const { filter } = useParams();

    useEffect(() => {
        // Fetch orders based on filter
    }, [filter]);

    return (
        <div className={classes.container}>
            <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

            {orders?.length === 0 && (
                <NotFound
                    linkRoute={filter ? '/orders' : '/'}
                    linkText={filter ? 'Show All' : 'Go To Home Page'}
                />
            )}

            {orders &&
                orders.map((order, index) => (
                    <div key={order.id} className={classes.order_summary}>
                        <div className={classes.header}>
                            <span>{index + 1}</span> {/* Auto-incremented ID */}
                            <span>
                                <DateTime date={order.createdAt} />
                            </span>
                            <span>{order.status}</span>
                        </div>
                        <div className={classes.items}>
                            {order.items.map(item => (
                                <Link key={item.food.id} to={`/food/${item.food.id}`}>
                                    <img src={item.food.imageUrl} alt={item.food.name} />
                                </Link>
                            ))}
                        </div>
                        <div className={classes.footer}>
                            <div>
                                <Link to={`/track/${order.id}`}>Show Order</Link>
                            </div>
                            <div>
                                <span className={classes.price}>
                                    <Price price={order.totalPrice} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}