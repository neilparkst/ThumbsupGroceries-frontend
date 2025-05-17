import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import './TrolleyPage.scss';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Data/GlobalState/Store';
import { getTimeSlots, getTrolleyCheckoutUrl, getTrolleyContent, removeTrolleyItem, removeTrolleyItems, ServiceMethod, TrolleyItemRequest, TrolleyItemType, TrolleyTimeSlot, updateServiceMethod, updateTrolleyItem, validateTrolley } from '../../Data/TrolleyData';
import LoadingCircle from '../../Components/LoadingCircle';
import { toast } from 'react-toastify';
import { Button, ButtonBase, capitalize, Checkbox, TextField } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { domain } from '../../Data/Settings';
import { Cancel } from '@mui/icons-material';
import { getMyInfo } from '../../Data/UserData';

const TrolleyPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const queryClient = useQueryClient();
    const {data: trolley, isLoading, isError} = useQuery({
        queryKey: ['trolley', token],
        queryFn: async () => {
            if(token){
                const response = await getTrolleyContent(token);
                if('errorMessage' in response){
                    throw new Error(response.errorMessage);
                }
    
                return response;
            }
        }
    });
    const chosenDateRef = useRef('');

    const [selectedTrolleyItems, setSelectedTrolleyItems] = useState<Set<number>>(new Set());
    const [deliveryAddress, setDeliveryAddress] = useState('');

    useEffect(() => {
        if(isError){
            toast.error("Failed to get trolley");
        }
    }, [isError])

    useEffect(() => {
        const getServiceAddress = async () => {
            if(token){
                const response = await getMyInfo(token);
                if('errorMessage' in response){
                    toast.error('Could not read user\'s address');
                    return;
                }
    
                setDeliveryAddress(response.address ?? '');
            }
        }

        getServiceAddress();
    }, [token])

    if(!trolley || trolley.itemCount === 0){
        return (
            <div className='TrolleyPage'>
                <div className="TrolleyPageHeader">
                    <div className="Intro">
                        <span className='Title'>Trolley</span>
                        {trolley?.itemCount === 0 &&
                        <span className='ItemCount'>No items</span>
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='TrolleyPage'>
            <div className="TrolleyPageHeader">
                <div className="Intro">
                    <span className='Title'>Trolley</span>
                    <span className='ItemCount'>{trolley.itemCount} items</span>
                </div>
                <div className="SelectAllAndRemove">
                    <Checkbox
                        checked={trolley.itemCount === selectedTrolleyItems.size}
                        onClick={() => {
                            if(trolley.itemCount === selectedTrolleyItems.size){
                                setSelectedTrolleyItems(new Set());
                            } else{
                                setSelectedTrolleyItems(new Set(trolley.items.map(item => item.trolleyItemId)));
                            }
                        }}
                    />
                    <Button
                        variant='contained'
                        size='small'
                        disabled={selectedTrolleyItems.size === 0}
                        onClick={async () => {
                            if(token){
                                const response = await removeTrolleyItems(Array.from(selectedTrolleyItems), token);
                                if('errorMessage' in response){
                                    toast.error('Failed to remove items from trolley');
                                    return;
                                }
                                queryClient.invalidateQueries({queryKey: ['trolley']});
                                queryClient.invalidateQueries({queryKey: ['trolleyCount']});
                                setSelectedTrolleyItems(new Set());
                            } else{
                                toast.error('Failed to remove items from trolley');
                            }
                        }}
                    >
                        Remove
                    </Button>
                </div>
            </div>
            <div className="TrolleyItemList">
            {trolley.items.map(item => (
                <div key={item.trolleyItemId}>
                    <Checkbox
                        checked={selectedTrolleyItems.has(item.trolleyItemId)}
                        onClick={() => {
                            if(selectedTrolleyItems.has(item.trolleyItemId)){
                                setSelectedTrolleyItems(prev => {
                                    const newSelectedTrolleyItems = new Set(prev);
                                    newSelectedTrolleyItems.delete(item.trolleyItemId);
    
                                    return newSelectedTrolleyItems;
                                });
                            } else{
                                setSelectedTrolleyItems(prev => {
                                    const newSelectedTrolleyItems = new Set(prev);
                                    newSelectedTrolleyItems.add(item.trolleyItemId);
    
                                    return newSelectedTrolleyItems;
                                });
                            }
                        }}
                    />
                    <TrolleyItem key={item.quantity} item={item} />
                </div>
            ))}
            </div>
            <TrolleySummary
                method={trolley.method}
                serviceFee={trolley.serviceFee}
                bagFee={trolley.bagFee}
                subTotalPrice={trolley.subTotalPrice}
                totalPrice={trolley.totalPrice}
            />
            <TimeSlots
                method={trolley.method}
                address={trolley.method === 'delivery' ? deliveryAddress : 'ThumbsUp Grocery Branch'}
                onChangeMethod={async (newServiceMethod: ServiceMethod) => {
                    if(token){
                        const response = await updateServiceMethod(trolley.trolleyId, newServiceMethod, token);
                        if('errorMessage' in response){
                            toast.error(`Could not change to ${newServiceMethod}`);
                            return;
                        }
            
                        queryClient.invalidateQueries({queryKey: ['trolley']});
                    } else{
                        toast.error(`Could not change to ${newServiceMethod}`);
                    }
                }}
                onChangeTimeSlot={(chosenDate: string) => {
                    chosenDateRef.current = chosenDate;
                }}
            />
            <div className='CheckoutButton'>
                <Button
                    fullWidth
                    variant='contained'
                    onClick={async () => {
                        if(!chosenDateRef.current){
                            toast.error('Please select timeslot');
                            return;
                        } else if(trolley.method === 'delivery' && !deliveryAddress){
                            toast.error('Please set delivery address');
                            return;
                        }

                        if(token){
                            const trolleyValidationResponse = await validateTrolley({
                                trolleyId: trolley.trolleyId,
                                items: trolley.items.map(item => ({
                                    productId: item.productId,
                                    productPrice: item.productPrice,
                                    priceUnitType: item.productPriceUnitType,
                                    quantity: item.quantity,
                                    totalPrice: item.totalPrice
                                })),
                                subTotalPrice: trolley.subTotalPrice,
                                method: trolley.method,
                                serviceFee: trolley.serviceFee,
                                bagFee: trolley.bagFee,
                                totalPrice: trolley.totalPrice
                            }, token);

                            if('errorMessage' in trolleyValidationResponse){
                                toast.error('Could not checkout the trolley');
                                return;
                            } else if(!trolleyValidationResponse.isValid){
                                toast.error('Prices of some products have changed. Please reload the page');
                                return;
                            }

                            const checkoutUrlResponse = await getTrolleyCheckoutUrl({
                                trolleyId: trolley.trolleyId,
                                chosenDate: chosenDateRef.current,
                                chosenAddress: trolley.method === 'delivery' ? deliveryAddress : 'ThumbsUp Grocery Branch',
                                successUrl: window.location.protocol + '//' + window.location.host + '/trolley/checkout/success',
                                cancelUrl: window.location.protocol + '//' + window.location.host + '/trolley/checkout/cancel'
                            }, token);

                            if('errorMessage' in checkoutUrlResponse){
                                toast.error('Could not checkout the trolley');
                                return;
                            }

                            window.location.href = checkoutUrlResponse.url;

                        } else{
                            toast.error('Could not checkout the trolley');
                        }
                    }}
                >
                    Checkout
                </Button>
            </div>
            <LoadingCircle isOpen={isLoading} />
        </div>
    );
};

const TrolleyItem = ({item} : {item: TrolleyItemType}) => {
    const {
        trolleyItemId,
        productId,
        productName,
        productPrice,
        productPriceUnitType,
        image,
        quantity,
        totalPrice
    } = item;

    const token = useSelector((state: GlobalState) => state.user.token);

    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const queryClient = useQueryClient();
    const quantityMutation = useMutation({
        mutationFn: async ({trolleyItemId, request} : {trolleyItemId: number, request: TrolleyItemRequest}) => {
            const {productId, priceUnitType, quantity} = request;
            if(token){
                const response = await updateTrolleyItem(trolleyItemId, {productId, priceUnitType, quantity}, token);
                if('errorMessage' in response){
                    throw new Error();
                }

                return response.quantity;
            } else{
                throw new Error();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['trolley']});
        },
        onError: () => {
            setCurrentQuantity(quantity);
            toast.error('Failed to update item in trolley');
        }
    });


    return(
        <div className="TrolleyItem">
            <div className="TrolleyItemHeader">
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
            <div className="TrolleyItemContent">
                <div className="Product">
                    <img src={`${domain}${image}`} alt={productName} />
                    <div className="NameAndPrice">
                        <div className="Name">
                            {productName}
                        </div>
                        <div className="Price">
                            ${productPrice.toFixed(2)} / {productPriceUnitType}
                        </div>
                    </div>
                </div>
                <div className="Quantity">
                    <div className="QuantityController">
                        <ButtonBase
                            disabled={quantity === 1}
                            onClick={() => quantityMutation.mutate({
                                trolleyItemId,
                                request: {
                                    productId,
                                    priceUnitType: productPriceUnitType,
                                    quantity: quantity - 1
                                }
                            })}
                        >
                            -
                        </ButtonBase>
                        <TextField
                            type='number'
                            className='Input'
                            size='small'
                            value={currentQuantity}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if(productPriceUnitType === 'ea'){
                                    setCurrentQuantity(Math.trunc(value));
                                } else{
                                    setCurrentQuantity(value);
                                }
                            }}
                            onBlur={(e) => {
                                const value = Number(e.target.value);
                                if(value <= 0){
                                    setCurrentQuantity(quantity);
                                    return;
                                }
                                
                                quantityMutation.mutate({
                                trolleyItemId,
                                request: {
                                    productId,
                                    priceUnitType: productPriceUnitType,
                                    quantity: productPriceUnitType === 'ea' ? Math.trunc(value) : value
                                }})
                            }}
                        />
                        <ButtonBase
                            onClick={() => quantityMutation.mutate({
                                trolleyItemId,
                                request: {
                                    productId,
                                    priceUnitType: productPriceUnitType,
                                    quantity: quantity + 1
                                }
                            })}
                        >
                            +
                        </ButtonBase>
                    </div>
                    <Button
                        onClick={async () => {
                            if(token){
                                const response = await removeTrolleyItem(trolleyItemId, token);
                                if('errorMessage' in response){
                                    toast.error('Failed to remove item from trolley');
                                    return;
                                }
                                queryClient.invalidateQueries({queryKey: ['trolley']});
                                queryClient.invalidateQueries({queryKey: ['trolleyCount']});

                            } else{
                                toast.error('Failed to remove item from trolley');
                            }
                        }}
                    >
                        <Cancel />
                        Remove
                    </Button>
                </div>
                <div className="TotalPricePerItem">
                    ${totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    )
}

const TrolleySummary = ({
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
        <div className="TrolleySummary">
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

const TimeSlots = ({
    method,
    address,
    onChangeMethod,
    onChangeTimeSlot
} : {
    method: ServiceMethod,
    address: string,
    onChangeMethod: (method: ServiceMethod) => void,
    onChangeTimeSlot: (chosenDate: string) => void
}) => {
    const [groupedTimeSlots, setGroupedTimeSlots] = useState<GroupedTimeSlotsType>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);

    const timeslotsForSelectedDate = groupedTimeSlots.find(grouped => grouped.date === selectedDate)?.slots;

    useEffect(() => {
        const getNewTimeSlots = async () => {
            const response = await getTimeSlots(method);
                if('errorMessage' in response){
                toast.error('Could not load timeslots');
                return;
            }

            setGroupedTimeSlots(groupTimeSlotsByDate(response));
        }

        getNewTimeSlots();
    }, [method])

    return (
        <div className='TimeSlots'>
            <div className="Address">
                {`To: ${address}`}
            </div>
            <div className="MethodOptions">
               <div
                    className={`MethodCard${method==='delivery' ? ' Selected' : ''}`}
                    onClick={() => {
                        onChangeMethod('delivery');
                        setSelectedDate('');
                        setSelectedTimeSlotId(null);
                    }}
                >
                   {method === 'delivery' ? <LocalShippingIcon /> : <LocalShippingOutlinedIcon />}
                   <span>Delivery</span>
               </div>
               <div
                    className={`MethodCard${method==='pickup' ? ' Selected' : ''}`}
                    onClick={() => {
                        onChangeMethod('pickup');
                        setSelectedDate('');
                        setSelectedTimeSlotId(null);
                    }}
                >
                   {method === 'pickup' ? <ShoppingBagIcon /> : <ShoppingBagOutlinedIcon />}
                   <span>Pick up</span>
               </div>
            </div>
            <div className="TimeOptions">
                <div className="Dates">
                    {groupedTimeSlots.map(grouped => {
                        const date = new Date(grouped.date);
                        const day = date.getDate();
                        const month = date.toLocaleString('nz', {month: 'short'});
                        const weekday = date.toLocaleString('nz', {weekday: 'short'});

                        return (
                            <div
                                key={grouped.date}
                                className={`Date${selectedDate === grouped.date ? ' Selected' : ''}`}
                                onClick={() => {
                                    setSelectedDate(grouped.date);
                                    setSelectedTimeSlotId(null);
                                }}
                            >
                                {`${day} ${month} ${weekday}`}
                            </div>
                        )
                    })}
                </div>
                <div className="Times">
                    {timeslotsForSelectedDate?.map(slot => {
                        const startTime = new Date(slot.start);
                        const endTime = new Date(slot.end);

                        return (
                            <div
                                key={slot.timeSlotId}
                                className={`Time${selectedTimeSlotId === slot.timeSlotId ? ' Selected' : ''}${slot.status === 'unavailable' ? ' Unavailable' : ''}`}
                                onClick={() => {
                                    if(slot.status === 'unavailable'){
                                        return;
                                    }
                                    setSelectedTimeSlotId(slot.timeSlotId);
                                    onChangeTimeSlot(slot.start);
                                }}
                            >
                                {`${startTime.getHours()}:${startTime.getMinutes() < 10 ? ('0' + startTime.getMinutes()) : startTime.getMinutes()} - ${endTime.getHours()}:${endTime.getMinutes() < 10 ? ('0' + endTime.getMinutes()) : endTime.getMinutes()}`}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

type GroupedTimeSlotsType = {date: string, slots: TrolleyTimeSlot[]}[];
const groupTimeSlotsByDate = (timeSlots: TrolleyTimeSlot[]) => {
    const grouped: {[date: string]: TrolleyTimeSlot[]} = {};

    for (const timeSlot of timeSlots) {
        const date = timeSlot.start.split("T")[0];

        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(timeSlot);
    }

    return Object.entries(grouped).map(([date, slots]) => ({
        date,
        slots,
    }));
}

export default TrolleyPage;