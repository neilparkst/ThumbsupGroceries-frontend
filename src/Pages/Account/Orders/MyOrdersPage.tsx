import React, { useEffect, useState } from 'react';
import './MyOrdersPage.scss';
import Card from '../../../Components/Card';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import { toast } from 'react-toastify';
import { getOrders, OrderSimple } from '../../../Data/OrderData';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const [orders, setOrders] = useState<OrderSimple[]>([]);

    useEffect(() => {
        const getNewOrders = async () => {
            if(token){
                const response = await getOrders(token);
                if('errorMessage' in response){
                    toast.error('Could not load orders');
                    return;
                }

                setOrders(response);
    
            } else{
                toast.error('Could not load orders');
            }
        }

        getNewOrders();
    }, [token])

    return (
        <Card title='Orders'>
            <div className='MyOrdersPage'>
                {orders.map(order => {
                    const orderDate = (new Date(order.orderDate)).toLocaleString('nz', {day: '2-digit', month: 'short', year: 'numeric'});
                    const chosenDateObject= new Date(order.chosenDate);
                    const chosenDate = chosenDateObject.toLocaleString('nz', {day: '2-digit', month: 'short', year: 'numeric'});
                    const chosenStartTime = chosenDateObject.getHours() + ":" + (chosenDateObject.getMinutes() < 10 ? '0' + chosenDateObject.getMinutes() : chosenDateObject.getMinutes());
                    if(order.serviceMethod === 'delivery'){
                        chosenDateObject.setHours(chosenDateObject.getHours() + 2);
                    }
                    chosenDateObject.setMinutes(chosenDateObject.getMinutes() + 30);
                    const chosenEndTime = chosenDateObject.getHours() + ":" + (chosenDateObject.getMinutes() < 10 ? '0' + chosenDateObject.getMinutes() : chosenDateObject.getMinutes());

                    return (
                        <Link to={`/account/orders/${order.orderId}`} style={{textDecoration: 'none'}}>
                            <div className={`Order ${order.orderStatus === 'canceled' ? ' Canceled' : ''}`}>
                                <div className='OrderHeader'>
                                    <div className='OrderDate'>
                                        Ordered at: {orderDate}
                                    </div>
                                    <div className='OrderStatus'>
                                        {order.orderStatus}
                                    </div>
                                </div>
                                <div className='TotalAmount'>
                                    ${(order.totalAmount / 100).toFixed(2)}
                                </div>
                                <div className="Address">
                                    {(order.serviceMethod === 'delivery' ? 'Delivery to ' : 'Pick up at ') + order.chosenAddress}
                                </div>
                                <div className="ExpectedDate">
                                    {`Expected Time: ${chosenDate} ${chosenStartTime} - ${chosenEndTime}`}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </Card>
    );
};

export default MyOrdersPage;