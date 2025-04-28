import React, { ReactNode, useEffect, useState } from 'react';
import './HomePage.scss';
import { getProducts, ProductSimple } from '../../Data/ProductData';
import ProductCard from '../../Components/ProductCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Filter1Icon from '@mui/icons-material/Filter1';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    

    return (
        <div className="Homepage">
            <div className="ProductCarousel">

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