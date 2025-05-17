import React, { ReactNode, useEffect, useState } from 'react';
import './MembershipSubscriptionPage.scss';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Filter1Icon from '@mui/icons-material/Filter1';
import { getMembershipCheckoutUrl, getMembershipOptions, MembershipOptionType } from '../../Data/MembershipData';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Data/GlobalState/Store';
import { useNavigate } from 'react-router-dom';

const MembershipSubscriptionPage = () => {
    return (
        <div className='MembershipSubscriptionPage'>
            <div className="MembershipSubscriptionPageHeader">
                <div className='Title'>
                    Membership
                </div>
                <div className='Description'>
                    Get unlimited deliveries for only $19.99 per month.
                </div>
            </div>
            <MembershipSelection />
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
            </div>
        </div>
    );
};

const MembershipSelection = () => {
    const token = useSelector((state: GlobalState) => state.user.token);
    const navigate = useNavigate();

    const [membershipOptions, setMembershipOptions] = useState<MembershipOptionType[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<number>(0);

    useEffect(() => {
        const getNewMembershipOptions = async () => {
            const response = await getMembershipOptions();
            if('errorMessage' in response){
                toast.error('Could not load membership options');
                return;
            }
    
            setMembershipOptions(response);
            setSelectedPlanId(response[0].planId);
        }

        getNewMembershipOptions();
    }, [])

    return (
        <div className="MembershipSelection">
            <div className="MembershipOptions">
                {membershipOptions.map(option => (
                    <MembershipOption
                        key={option.planId}
                        option={option}
                        isSelected={option.planId === selectedPlanId}
                        onClick={() => setSelectedPlanId(option.planId)}
                    />
                ))}
            </div>
            <div className="MembershipButton">
                <Button
                    onClick={async () => {
                        if(token){
                            const checkoutUrlResponse = await getMembershipCheckoutUrl({
                                planId: selectedPlanId,
                                successUrl: window.location.protocol + '//' + window.location.host + '/membershipsubscription/checkout/success',
                                cancelUrl: window.location.protocol + '//' + window.location.host + '/membershipsubscription/checkout/cancel'
                            }, token);
    
                            if('errorMessage' in checkoutUrlResponse){
                                toast.error('Could not request subscription');
                                return;
                            }
    
                            window.location.href = checkoutUrlResponse.url;
                        } else{
                            navigate('/signin?redirectTo=membershipsubscription');
                        }
                    }}
                >
                    Subscribe
                </Button>
            </div>
        </div>
    )
}

const MembershipOption = ({option, isSelected, onClick} : {option: MembershipOptionType, isSelected: boolean, onClick: () => void}) => {
    const {name, price, durationMonths, description} = option;

    return (
        <div
            className={`MembershipOption${isSelected ? ' Selected' : ''}`}
            onClick={() => onClick()}
        >
            <div className="Name">
                {name}
            </div>
            <div className="Price">
                ${price}
            </div>
            <div className="Duration">
                Every {durationMonths} months
            </div>
            <div className="Description">
                {description}
            </div>
        </div>
    )
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

export default MembershipSubscriptionPage;