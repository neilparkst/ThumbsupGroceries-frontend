import React, { useEffect, useState } from 'react';
import './MyMembershipStatusPage.scss';
import { getMembershipPortalUrl, getMyMembership, UserMembership } from '../../../Data/UserData';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import { toast } from 'react-toastify';
import Card from '../../../Components/Card';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LoadingCircle from '../../../Components/LoadingCircle';

const MyMembershipStatusPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);

    const [userMembership, setUserMembership] = useState<UserMembership | {}>();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCurrentUserMembership = async () => {
            if(token){
                setIsLoading(true);
                const response = await getMyMembership(token);
                setIsLoading(false);
                if('errorMessage' in response){
                    toast.error('Could not load my membership info');
                    return;
                }
                setUserMembership(response);
            } else{
                setUserMembership({});
            }
        }

        getCurrentUserMembership();
    }, [token])

    if(userMembership === undefined || !('membershipId' in userMembership) || userMembership.status !== 'active'){
        return(
            <div className="MyMembershipStatusPage">
                <Card title='My Membership'>
                    <div className='Message'>
                        You're not in a membership!
                    </div>
                    <div className="MembershipButton">
                        <Link to="/membershipsubscription">
                            <Button>
                                Go to membership
                            </Button>
                        </Link>
                    </div>
                    <LoadingCircle isOpen={isLoading} />
                </Card>
            </div>
        )
    }

    return (
        <div className='MyMembershipStatusPage'>
            <Card title='My Membership'>
                <table className='MembershipInfoTable'>
                    <tbody>
                        <tr>
                            <td>Membership Type</td>
                            <td>{userMembership.planName}</td>
                        </tr>
                        <tr>
                            <td>Membership Price</td>
                            <td>{userMembership.planPrice} per month</td>
                        </tr>
                        <tr>
                            <td>Start Date</td>
                            <td>{new Date(userMembership.startDate).toLocaleString('nz', {month: 'short', day: '2-digit', year: 'numeric'})}</td>
                        </tr>
                        <tr>
                            <td>Next Payment Date</td>
                            <td>{new Date(userMembership.renewalDate).toLocaleString('nz', {month: 'short', day: '2-digit', year: 'numeric'})}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="MembershipButton">
                    <Button
                        onClick={async () => {
                            if(token){
                                setIsLoading(true);
                                const portalUrl = await getMembershipPortalUrl({
                                    returnUrl: window.location.href
                                }, token);
                                setIsLoading(false);
            
                                if('errorMessage' in portalUrl){
                                    toast.error('Error occurred!');
                                    return;
                                }
            
                                window.location.href = portalUrl.url;
                            }
                        }}
                    >
                        Manage Membership
                    </Button>
                </div>
            </Card>
            <LoadingCircle isOpen={isLoading} />
        </div>
    );
};

export default MyMembershipStatusPage;