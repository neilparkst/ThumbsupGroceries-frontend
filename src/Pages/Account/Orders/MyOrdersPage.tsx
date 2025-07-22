import React, { useEffect, useState } from 'react';
import './MyOrdersPage.scss';
import Card from '../../../Components/Card';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import { toast } from 'react-toastify';
import { getOrders, OrderSimple } from '../../../Data/OrderData';
import { Link } from 'react-router-dom';
import LoadingCircle from '../../../Components/LoadingCircle';

const MyOrdersPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const [orders, setOrders] = useState<OrderSimple[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getNewOrders = async () => {
            if(token){
                setIsLoading(true);
                const response = await getOrders(token);
                setIsLoading(false);
                if('errorMessage' in response){
                    toast.error('Could not load orders');
                    return;
                }

                setOrders(response);
            }
        }

        getNewOrders();
    }, [token])

    return (
        <Card title='Orders'>
            <div className='MyOrdersPage'>
                {orders.map(order => {
                    const orderDate = (new Date(order.orderDate + "Z")).toLocaleString('nz', {day: '2-digit', month: 'short', year: 'numeric'});
                    const chosenStartDateObject= new Date(order.chosenStartDate);
                    const chosenStartDate = chosenStartDateObject.toLocaleString('nz', {day: '2-digit', month: 'short', year: 'numeric'});
                    const chosenStartTime = chosenStartDateObject.getHours() + ":" + (chosenStartDateObject.getMinutes() < 10 ? '0' + chosenStartDateObject.getMinutes() : chosenStartDateObject.getMinutes());
                    
                    const chosenEndDateObject = new Date(order.chosenEndDate);
                    if(order.chosenStartDate === order.chosenEndDate){
                        if(order.serviceMethod === 'delivery'){
                            chosenEndDateObject.setHours(chosenEndDateObject.getHours() + 2);
                        }
                        chosenEndDateObject.setMinutes(chosenEndDateObject.getMinutes() + 30);
                    }
                    const chosenEndTime = chosenEndDateObject.getHours() + ":" + (chosenEndDateObject.getMinutes() < 10 ? '0' + chosenEndDateObject.getMinutes() : chosenEndDateObject.getMinutes());

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
                                    {`Expected Time: ${chosenStartDate} ${chosenStartTime} - ${chosenEndTime}`}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <LoadingCircle isOpen={isLoading} />
        </Card>
    );
};

export default MyOrdersPage;