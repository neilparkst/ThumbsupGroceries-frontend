import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import './ProductDetailPage.scss';
import { Link, useParams } from 'react-router-dom';
import { addReview, getProduct, getReviews, Product, removeReview, ReviewType, updateReview } from '../../../Data/ProductData';
import { toast } from 'react-toastify';
import { domain } from '../../../Data/Settings';
import { Box, Button, Pagination, Popper, Rating, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import Modal from '../../../Components/Modal';
import LoadingCircle from '../../../Components/LoadingCircle';

const ProductDetailPage = () => {
    const params = useParams();
    const productId = params.productId && parseInt(params.productId);

    const [ product, setProduct ] = useState<Product | null>(null);
    const [ selectedImageIndex, setSelectedImageIndex ] = useState(0);

    const [quantity, setQuantity] = useState(1);
    const [popperOpen, setPopperOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        const getProductInfo = async () => {
            if(!productId || isNaN(productId)){
                return;
            }
            setIsLoading(true);
            const response = await getProduct(productId);
            setIsLoading(false);
            if('errorMessage' in response){
                toast.error(response.errorMessage);
                return;
            }

            setProduct(response);
        }

        getProductInfo();

    }, [productId])

    if(!product){
        return <LoadingCircle isOpen={isLoading} />;
    }

    return (
        <div className='ProductDetailPage'>
            <div className="MainSection">
                <div className="ImageContainer">
                    <div className="SelectedImage">
                        {(product.images && product.images.length > 0) ?
                            <img src={`${domain}${product.images[selectedImageIndex]}`} alt="big img" /> :
                            <img src="/no_image.avif" alt="no img" />
                        }
                    </div>
                    <div className="ImageList">
                        {product?.images.map((image, idx) => (
                            <img
                                key={image}
                                src={`${domain}${image}`}
                                alt={product.name}
                                className={idx === selectedImageIndex ? 'Selected' : ''}
                                onClick={() => setSelectedImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>
                <div className="ProductDescription">
                    <div className="Title">
                        {product.name}
                    </div>
                    <div className='RatingPriceContainer'>
                        <div className='RatingContainer'>
                            <Rating
                                name="read-only-rating"
                                value={product.rating}
                                precision={0.5}
                                readOnly
                                size="small"
                            />
                            <span className='ReviewCount'>({product.reviewCount})</span>
                        </div>
                        <div className='PriceContainer'>{`$${(product.price / 100).toFixed(2)} / ${product.priceUnitType}`}</div>
                    </div>
                    <div className="TrolleyContainer">
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
                    <div className="Description">
                        {product.description}
                    </div>
                </div>
            </div>
            <ReviewContainer productId={product.productId} />
        </div>
    );
};

const ReviewContainer = memo(({productId} : {productId: number}) => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const [ reviews, setReviews ] = useState<ReviewType[]>([]);
    const [ reviewPage, setReviewPage ] = useState<number>(1);
    const [ isLoading, setIsLoading ] = useState(false);

    const fetchReviews = useCallback(async () => {
        if(!productId || isNaN(productId)){
            return;
        }
        setIsLoading(true);
        const response = await getReviews(productId, reviewPage);
        setIsLoading(false);
        if('errorMessage' in response){
            return;
        }

        setReviews(response);
    }, [productId, reviewPage])

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews, productId, reviewPage])

    return(
        <div className="ReviewContainer">
            <h2>Reviews</h2>
            {token && <ReviewInput productId={productId} onReviewChange={fetchReviews} />}
            <div className="ReviewList">
                {reviews.map(review => (
                    <Review review={review} productId={productId} onReviewChange={fetchReviews} />
                ))}
                <LoadingCircle isOpen={isLoading} isLocal />
                <Pagination
                    count={Math.ceil((reviews.length) / 5)}
                    page={reviewPage}
                    onChange={(e, value) => {setReviewPage(value)}}
                />
            </div>
        </div>
    )
});

const ReviewInput = ({defaultComment, defaultRating, reviewId, productId, onReviewChange}: {defaultComment?: string, defaultRating?: number, reviewId?: number, productId: number, onReviewChange: () => void}) => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const [ comment, setComment ] = useState(defaultComment || '');
    const [ rating, setRating ] = useState(defaultRating || 0);
    const [ hoverRating, setHoverRating ] = useState(-1);

    return(
        <div className="ReviewInput">
            <Box sx={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Rating
                    name="rating"
                    value={rating}
                    precision={0.5}
                    onChange={(e, newValue) => {setRating(newValue || 0);}}
                    onChangeActive={(e, hoverValue) => {setHoverRating(hoverValue);}}
                />
                {comment !== null && 
                    hoverRating < 0 ? rating : hoverRating
                }
            </Box>
            <TextField
                multiline
                fullWidth
                value={comment}
                onChange={(e) => {setComment(e.target.value);}}
            />
            <Box sx={{textAlign: 'right'}}>
                <Button
                    disabled={!comment || !rating}
                    variant='contained'
                    onClick={async () => {
                        let response;
                        if(reviewId){ // edit mode
                            response = await updateReview(productId, reviewId, {comment, rating}, token || '');
                        } else{
                            response = await addReview(productId, {comment, rating}, token || '');
                        }
                        if('errorMessage' in response){
                            toast.error(response.errorMessage);
                            return;
                        }

                        onReviewChange();
                    }}
                >
                    {reviewId ? 'Edit' : 'Add'}
                </Button>
            </Box>
        </div>
    )
}

const Review = ({review, productId, onReviewChange} : {review: ReviewType, productId: number, onReviewChange: () => void}) =>{
    const token = useSelector((state: GlobalState) => state.user.token);
    const userId = useSelector((state: GlobalState) => state.user.info?.userId);

    const [ isEdit, setIsEdit ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return (
        <div className="Review">
            <div className="ReviewHeader">
                <div className="MetaData">
                    <span className='UserName'>{review.userName}</span>
                    <span className='Rating'>
                        <Rating
                            name="read-only-rating"
                            value={review.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                    </span>
                    <span className='Date'>{(new Date(review.updatedAt)).toLocaleDateString('nz')}</span>
                </div>
                <div className="Buttons" >
                    {userId === review.userId && (<>
                        <Button
                            size='small'
                            onClick={() => {
                                setIsEdit(prev => !prev);
                            }}
                            color={isEdit ? 'info' : 'primary'}
                        >
                            {isEdit ? 'Cancel' : 'Edit'}
                        </Button>
                        <Button
                            size='small'
                            color='error'
                            onClick={() => {setIsModalOpen(true);}}
                        >
                            Delete
                        </Button>
                        <Modal isOpen={isModalOpen} handleClose={() => {setIsModalOpen(false);}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '20px', textAlign: 'center', marginTop: '30px'}}>
                                <span>
                                    Do you really want to delete?
                                </span>
                                <Box sx={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        onClick={async () => {
                                            const response = await removeReview(productId, review.reviewId, token || '');
                                            if('errorMessage' in response){
                                                toast.error(response.errorMessage);
                                                return;
                                            }

                                            onReviewChange();
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </div>
                        </Modal>
                    </>)}
                </div>
            </div>
            <div className="Content">
                {isEdit?
                    <ReviewInput
                        defaultComment={review.comment}
                        defaultRating={review.rating}
                        reviewId={review.reviewId}
                        productId={productId}
                        onReviewChange={() => {
                            onReviewChange();
                            setIsEdit(false);
                        }}
                    />:
                    review.comment
                }
            </div>
        </div>
    )
}

export default ProductDetailPage;