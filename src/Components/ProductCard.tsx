import React, { useRef, useState } from 'react';
import './Styles/ProductCard.scss';
import { ProductSimple } from '../Data/ProductData';
import { domain } from '../Data/Settings';
import { Button, Popper, Rating, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({product}: {product: ProductSimple}) => {
    const {productId, name, price, priceUnitType, image, rating, reviewCount} = product;

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
                <div className='PriceContainer'>{`$${price.toFixed(2)} / ${priceUnitType}`}</div>
            </div>
            <div className='TrolleyContainer'>
                <div className="TrolleyQuantityContainer">
                    {/* <IconButton onClick={() => setQuantity(Math.max(quantity - 1, 1))} sx={{padding: 0}}>
                        <RemoveIcon sx={{fontSize: 18}} />
                    </IconButton> */}
                    <TextField
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
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
                    {/* <IconButton onClick={() => setQuantity(quantity + 1)} sx={{padding: 0}}>
                        <AddIcon sx={{fontSize: 18}} />
                    </IconButton> */}
                </div>
                <Button
                    variant="contained"
                    className='TrolleyButton'
                    ref={buttonRef}
                    onClick={() => {
                        setPopperOpen(true);
                        setTimeout(() => setPopperOpen(false), 2000);
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