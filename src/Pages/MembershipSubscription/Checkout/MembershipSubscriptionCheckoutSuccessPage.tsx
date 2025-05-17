import React from 'react';
import Card from '../../../Components/Card';
import { Link } from 'react-router-dom';

const MembershipSubscriptionCheckoutSuccessPage = () => {
    return (
        <Card title='Checkout completed'>
            <div style={{textAlign: 'center'}}>
                <div>
                    your checkout has been successful!
                </div>
                <Link to="/">Go to Home</Link>
            </div>
        </Card>
    );
};

export default MembershipSubscriptionCheckoutSuccessPage;