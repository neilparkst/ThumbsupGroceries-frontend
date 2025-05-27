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
import { getMembershipPortalUrl, getMyMembership, UserMembership } from '../../Data/UserData';
import LoadingCircle from '../../Components/LoadingCircle';

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
    const [userMembership, setUserMembership] = useState<UserMembership | {}>();

    const [isOptionsLoading, setIsOptionsLoading] = useState(false);
    const [isMyMembershipLoading, setIsMyMembershipLoading] = useState(false);
    const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
    const isLoading = isOptionsLoading || isMyMembershipLoading || isSubscriptionLoading;

    useEffect(() => {
        const getNewMembershipOptions = async () => {
            setIsOptionsLoading(true);
            const response = await getMembershipOptions();
            setIsOptionsLoading(false);
            if('errorMessage' in response){
                toast.error('Could not load membership options');
                return;
            }
    
            setMembershipOptions(response);
            setSelectedPlanId(response[0].planId);
        }

        getNewMembershipOptions();
    }, [])

    useEffect(() => {
        const getCurrentUserMembership = async () => {
            if(token){
                setIsMyMembershipLoading(true);
                const response = await getMyMembership(token);
                setIsMyMembershipLoading(false);
                if('errorMessage' in response){
                    return;
                }
                setUserMembership(response);
            } else{
                setUserMembership({});
            }
        }

        getCurrentUserMembership();
    }, [token])

    let membershipButton;
    if(userMembership === undefined){
        membershipButton = '';
    } else if('planId' in userMembership){
        membershipButton = (
            <Button
                onClick={async () => {
                    if(token){
                        setIsSubscriptionLoading(true);
                        const portalUrl = await getMembershipPortalUrl({
                            returnUrl: window.location.href
                        }, token);
                        setIsSubscriptionLoading(false);

                        if('errorMessage' in portalUrl){
                            toast.error('Could not request subscription');
                            return;
                        }
    
                        window.location.href = portalUrl.url;
                    } else{
                        navigate('/signin?redirectTo=membershipsubscription');
                    }
                }}
            >
                {userMembership.planName === 'Saver' ? 'Upgrade' : 'Manage'} Membership
            </Button>
        )
    } else{
        membershipButton = (
            <Button
                onClick={async () => {
                    if(token){
                        setIsSubscriptionLoading(true);
                        const checkoutUrlResponse = await getMembershipCheckoutUrl({
                            planId: selectedPlanId,
                            successUrl: window.location.protocol + '//' + window.location.host + '/membershipsubscription/checkout/success',
                            cancelUrl: window.location.protocol + '//' + window.location.host + '/membershipsubscription/checkout/cancel'
                        }, token);
                        setIsSubscriptionLoading(false);
    
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
        );
    }

    const userMembershipPlanId = userMembership && ('planId' in userMembership) && userMembership.planId;

    return (
        <div className="MembershipSelection">
            {userMembershipPlanId &&
            <div className="MembershipMessage">
                you're currently <span>{userMembership.planName}</span>
            </div>
            }
            <div className="MembershipOptions">
                {membershipOptions.map(option => (
                    <MembershipOption
                        key={option.planId}
                        option={option}
                        isSelected={userMembershipPlanId ? (option.planId === userMembershipPlanId) : (option.planId === selectedPlanId)}
                        onClick={() => {
                            if(userMembershipPlanId){
                                return;
                            }
                            setSelectedPlanId(option.planId)
                        }}
                        isSelectable = {!userMembershipPlanId}
                    />
                ))}
            </div>
            <div className="MembershipButton">
                {membershipButton}
            </div>
            <LoadingCircle isOpen={isLoading} />
        </div>
    )
}

const MembershipOption = ({option, isSelected, onClick, isSelectable} : {option: MembershipOptionType, isSelected: boolean, onClick: () => void, isSelectable: boolean}) => {
    const {name, price, durationMonths, description} = option;

    return (
        <div
            className={`MembershipOption${isSelected ? ' Selected' : ''}${isSelectable ? ' Selectable' : ''}`}
            onClick={() => onClick()}
        >
            <div className="Name">
                {name}
            </div>
            <div className="Price">
                ${(price / 100).toFixed(2)}
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