import React, { useEffect, useState } from 'react';
import './OrderPage.scss';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import { cancelOrder, getOrder, OrderContent, OrderItemType, ServiceMethod } from '../../../../Data/OrderData';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingCircle from '../../../../Components/LoadingCircle';
import { domain } from '../../../../Data/Settings';
import Modal from '../../../../Components/Modal';
import { Box, Button, capitalize } from '@mui/material';

const OrderPage = () => {
    const params = useParams();
    const orderId = params.orderId ? parseInt(params.orderId) : undefined;
    const navigate = useNavigate();

    const token = useSelector((state: GlobalState) => state.user.token);

    const [order, setOrder] = useState<OrderContent>();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getNewOrders = async () => {
            if(token && orderId){
                setIsLoading(true);
                const response = await getOrder(orderId, token);
                setIsLoading(false);
                if('errorMessage' in response){
                    toast.error('Could not load order');
                    return;
                }

                setOrder(response);
            }
        }

        getNewOrders();
    }, [orderId, token])

    if(!order){
        return <LoadingCircle isOpen={isLoading} />;
    }

    return (
        <div className='OrderPage'>
            <div className="OrderPageHeader">
                <div className="Intro">
                    <span className='Title'>Order</span>
                    <span className='ItemCount'>{order.orderItems.length} items</span>
                </div>
            </div>
            <div className="OrderItemList">
                {order.orderItems.map(item => (
                    <OrderItem key={item.orderItemId} item={item} />
                ))}
            </div>
            <OrderSummary
                method={order.serviceMethod}
                serviceFee={order.serviceFee}
                bagFee={order.bagFee}
                subTotalPrice={order.subTotalAmount}
                totalPrice={order.totalAmount}
            />
            <div className="CancelButton">
                {order.orderStatus === 'registered' &&
                    <Button
                        onClick={() => setIsModalOpen(true)}
                    >
                        Cancel Order
                    </Button>
                }
                <Modal isOpen={isModalOpen} handleClose={() => {setIsModalOpen(false);}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '20px', textAlign: 'center', marginTop: '30px'}}>
                        <span>
                            Do you really want to cancel order?
                        </span>
                        <Box sx={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                            <Button
                                variant='contained'
                                color='error'
                                onClick={async () => {
                                    if(token){
                                        const response = await cancelOrder(order.orderId, token);
                                        if('errorMessage' in response){
                                            toast.error('Could not cancel order');
                                            return;
                                        }
                                    } else{
                                        toast.error('Could not cancel order');
                                    }

                                    setIsModalOpen(false);
                                    toast.success('Order cancel requested');
                                    navigate('/account/orders');
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setIsModalOpen(false);
                                }}
                            >
                                No
                            </Button>
                        </Box>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

const OrderItem = ({item} : {item: OrderItemType}) => {
    const {
        orderItemId,
        productId,
        productName,
        price,
        priceUnitType,
        image,
        quantity,
        totalPrice
    } = item;

    return(
        <div className="OrderItem">
            <div className="OrderItemHeader">
                <div className="Product">
                    Product
                </div>
                <div className="Quantity">
                    Quantity
                </div>
                <div className="TotalPricePerItem">
                    Item total
                </div>
            </div>
            <div className="OrderItemContent">
                <div className="Product">
                    <img src={`${domain}${image}`} alt={productName} />
                    <div className="NameAndPrice">
                        <div className="Name">
                            {productName}
                        </div>
                        <div className="Price">
                            ${price.toFixed(2)} / {priceUnitType}
                        </div>
                    </div>
                </div>
                <div className="Quantity">
                    {quantity}
                </div>
                <div className="TotalPricePerItem">
                    ${totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    )
}

const OrderSummary = ({
    method,
    serviceFee,
    bagFee,
    subTotalPrice,
    totalPrice
} : {
    method: ServiceMethod,
    serviceFee: number,
    bagFee: number,
    subTotalPrice: number,
    totalPrice: number
}) => {
    return(
        <div className="OrderSummary">
            <div className="ServiceFee">
                <div className="Name">
                    {capitalize(method)} Fee
                </div>
                <div className="Price">
                    ${serviceFee.toFixed(2)}
                </div>
            </div>
            <div className="Subtotal">
                <div className="Name">
                    Bag Fee
                </div>
                <div className="Price">
                    ${bagFee.toFixed(2)}
                </div>
            </div>
            <div className="Subtotal">
                <div className="Name">
                    Subtotal
                </div>
                <div className="Price">
                    ${subTotalPrice.toFixed(2)}
                </div>
            </div>
            <div className="Total">
                <div className="Name">
                    Total
                </div>
                <div className="Price">
                    ${totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );
}

export default OrderPage;