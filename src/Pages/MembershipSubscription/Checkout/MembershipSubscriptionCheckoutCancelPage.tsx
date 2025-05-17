import React from 'react';
import Card from '../../../Components/Card';
import { Link } from 'react-router-dom';

const MembershipSubscriptionCheckoutCancelPage = () => {
    return (
        <Card title='Checkout cancelled'>
            <div style={{textAlign: 'center'}}>
                <div>
                    you cancelled the checkout
                </div>
                <Link to="/membershipsubscription">Go to Membership Selection Page</Link>
            </div>
        </Card>
    );
};

export default MembershipSubscriptionCheckoutCancelPage;