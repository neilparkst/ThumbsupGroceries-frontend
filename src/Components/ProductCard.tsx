import React, { useRef, useState } from 'react';
import './Styles/ProductCard.scss';
import { ProductSimple } from '../Data/ProductData';
import { domain } from '../Data/Settings';
import { Button, Popper, Rating, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { addTrolleyItem } from '../Data/TrolleyData';
import { useSelector } from 'react-redux';
import { GlobalState } from '../Data/GlobalState/Store';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

const ProductCard = ({product}: {product: ProductSimple}) => {
    const {productId, name, price, priceUnitType, image, rating, reviewCount} = product;

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const token = useSelector((state: GlobalState) => state.user.token);

    const [quantity, setQuantity] = useState(1);
    const [popperOpen, setPopperOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div className='ProductCard'>
            <div className='ImageContainer'>
                <Link to={`/products/${productId}`}>
                    {image ?
                        <img src={`${domain}${image}`} alt="product-image" />:
                        <img src="/no_image.avif" alt="no img" />
                    }
                </Link>
            </div>
            <div className='NameContainer'>
                <Link to={`/products/${productId}`}>
                    <span>{name}</span>
                </Link>
            </div>
            <div className='RatingPriceContainer'>
                <div className='RatingContainer'>
                    <Rating
                        name="read-only-rating"
                        value={rating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                    <span className='ReviewCount'>({reviewCount})</span>
                </div>
                <div className='PriceContainer'>{`$${(price / 100).toFixed(2)} / ${priceUnitType}`}</div>
            </div>
            <div className='TrolleyContainer'>
                <div className="TrolleyQuantityContainer">
                    <TextField
                        value={quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if(priceUnitType === 'ea'){
                                setQuantity(Math.trunc(value));
                            } else{
                                setQuantity(value);
                            }
                        }}
                        type="number"
                        slotProps={{
                            htmlInput: {
                                min: 1
                            }
                        }}
                        size="small"
                        variant="outlined"
                        sx={{ width: 80, textAlign: 'center' }}
                    />
                </div>
                <Button
                    variant="contained"
                    className='TrolleyButton'
                    ref={buttonRef}
                    onClick={async () => {
                        if(token){
                            const response = await addTrolleyItem({productId, priceUnitType, quantity}, token);
                            if('errorMessage' in response){
                                toast.error('Failed to add item to trolley');
                                return;
                            }

                            queryClient.invalidateQueries({queryKey: ['trolleyCount']});
                            setPopperOpen(true);
                            setTimeout(() => setPopperOpen(false), 2000);
                        } else{
                            navigate('/signin');
                        }
                    }}
                >
                    Add to trolley
                </Button>
                <Popper open={popperOpen} anchorEl={buttonRef.current} placement="top" disablePortal>
                    <div className="PopperContent">
                        Added to Trolley. <Link to="/trolley">Go to trolley</Link>
                    </div>
                </Popper>
            </div>
        </div>
    );
};

export default ProductCard;