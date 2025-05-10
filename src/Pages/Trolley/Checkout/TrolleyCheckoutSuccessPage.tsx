import React from 'react';
import Card from '../../../Components/Card';
import { Link } from 'react-router-dom';

const TrolleyCheckoutSuccessPage = () => {
    return (
        <Card title='Checkout completed'>
            <div style={{textAlign: 'center'}}>
                <div>
                    your checkout has been successful!
                </div>
                <Link to="/account/orders">Go to orders</Link>
            </div>
        </Card>
    );
};

export default TrolleyCheckoutSuccessPage;