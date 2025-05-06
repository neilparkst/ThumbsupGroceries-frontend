import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import './TrolleyPage.scss';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Data/GlobalState/Store';
import { getTrolleyContent, TrolleyItemType } from '../../Data/TrolleyData';
import LoadingCircle from '../../Components/LoadingCircle';
import { toast } from 'react-toastify';
import { Button, ButtonBase, capitalize, Checkbox, TextField } from '@mui/material';
import { domain } from '../../Data/Settings';
import { Cancel } from '@mui/icons-material';

const TrolleyPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);
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
    })

    const [selectedTrolleyItems, setSelectedTrolleyItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        if(isError){
            toast.error("Failed to get trolley");
        }
    }, [isError])

    if(!trolley){
        return (
            <div className='TrolleyPage'>
                <div className="TrolleyPageHeader">
                    <div className="Intro">
                        <span className='Title'>Trolley</span>
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
                    />
                    <Button
                        variant='contained'
                        size='small'
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
                    />
                    <TrolleyItem item={item} />
                </div>
            ))}
            </div>
            <div className="TrolleySummary">
                <div className="ServiceFee">
                    <div className="Name">
                        {capitalize(trolley.method)} Fee
                    </div>
                    <div className="Price">
                        ${trolley.serviceFee.toFixed(2)}
                    </div>
                </div>
                <div className="Subtotal">
                    <div className="Name">
                        Subtotal
                    </div>
                    <div className="Price">
                        ${trolley.subTotalPrice.toFixed(2)}
                    </div>
                </div>
                <div className="Total">
                    <div className="Name">
                        Total
                    </div>
                    <div className="Price">
                        ${trolley.totalPrice.toFixed(2)}
                    </div>
                </div>
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

    const [currentQuantity, setCurrentQuantity] = useState(quantity);

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
                        >
                            <button
                                className='Button'
                                disabled={currentQuantity === 1}
                            >
                                -
                            </button>
                        </ButtonBase>
                        <TextField
                            className='Input'
                            value={currentQuantity}
                            size='small'
                        />
                        <ButtonBase>
                            <button
                                className='Button'
                            >
                                +
                            </button>
                        </ButtonBase>
                    </div>
                    <Button>
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

export default TrolleyPage;