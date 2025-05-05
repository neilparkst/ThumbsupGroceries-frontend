import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './HomePage.scss';
import { getProducts, ProductSimple } from '../../Data/ProductData';
import ProductCard from '../../Components/ProductCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Filter1Icon from '@mui/icons-material/Filter1';
import { Button, MobileStepper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import LoadingCircle from '../../Components/LoadingCircle';

const HomePage = () => {
    return (
        <div className="Homepage">
            <div className="ProductCarouselContainer">
                <ProductCarousel />
            </div>
            <div className="MembershipIntroduction">
                <div className="Title">
                    Why Membership?
                </div>
                <div className="MembershipIntroductionCardContainer">
                    {MembershipIntroductionCardContentList.map(cardContent => (
                        <MembershipIntroductionCard
                            {...cardContent}
                        />
                    ))}
                </div>
                <div className="MembershipPageButton">
                    <Link to="membershipsubscription">
                        <Button>
                            Go to membership
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ITEM_WIDTH = 228 + 20;
const ProductCarousel = () => {
    const {data: products, isLoading} = useQuery({
        queryKey: ['products', {categoryId: undefined, sort: 'relevance', search: undefined, page: 1, pageSize: 24}],
        queryFn: async () => {
            const response = await getProducts();
            if('errorMessage' in response){
                throw new Error(response.errorMessage);
            }

            return response as ProductSimple[];
        }
    })

    const carouselTrackRef = useRef<HTMLDivElement | null>(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    useEffect(() => {
        // measure carousel track width and calculate the number of items
        const updateItemsPerPage = () => {
            if (carouselTrackRef.current) {
                const containerWidth = carouselTrackRef.current.offsetWidth;
                const itemNumber = Math.floor(containerWidth / ITEM_WIDTH);
                setItemsPerPage(itemNumber || 1); // minimum 1
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, [products?.length]);

    if(!products){
        return <LoadingCircle isOpen={isLoading} />;
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const scrollToPage = (page: number) => {
        if (carouselTrackRef.current) {
            carouselTrackRef.current.scrollTo({
                left: page * itemsPerPage * ITEM_WIDTH,
                behavior: "smooth",
            });
            setPageNumber(page);
        }
    };

    const nextPage = () => {
        if (pageNumber < totalPages - 1) {
            scrollToPage(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 0) {
            scrollToPage(pageNumber - 1);
        }
    };

    return (
        <div className="ProductCarousel">
            <div ref={carouselTrackRef} className="ProductCarouselTrack">
                {products.map(product => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
            <MobileStepper
                variant="dots"
                steps={totalPages}
                position="static"
                activeStep={pageNumber}
                nextButton={
                    <Button size="small" onClick={nextPage} disabled={pageNumber >= totalPages - 1}>
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={prevPage} disabled={pageNumber === 0}>
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
        </div>
    );
}

const MembershipIntroductionCardContentList = [
    {
        icon: <Filter1Icon sx={{fontSize: 48}} />,
        title: 'Pay one low subscription fee',
        description: 'Choose monthly or yearly. Cancel at anytime'
    },
    {
        icon: <AutorenewIcon sx={{fontSize: 48}} />,
        title: 'Get unlimited deliveries',
        description: 'Order as often as you like. Different minimum spend depending on the membership'
    },
    {
        icon: <CalendarMonthIcon sx={{fontSize: 48}} />,
        title: 'Choose any available time slot',
        description: 'Any time slot any day of the week.'
    },
]

const MembershipIntroductionCard = ({icon, title, description}: {icon: ReactNode, title: string, description: string}) => {
    return(
        <div className="MembershipIntroductionCard">
            <div className='Icon'>
                {icon}
            </div>
            <div className='Title'>
                {title}
            </div>
            <div className='Description'>
                {description}
            </div>
        </div>
    )
}

export default HomePage;