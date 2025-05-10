import React from 'react';
import Card from '../../../Components/Card';
import { Link } from 'react-router-dom';

const TrolleyCheckoutCancelPage = () => {
    return (
        <Card title='Checkout cancelled'>
            <div style={{textAlign: 'center'}}>
                <div>
                    you cancelled the checkout
                </div>
                <Link to="/trolley">Go to trolley</Link>
            </div>
        </Card>
    );
};

export default TrolleyCheckoutCancelPage;