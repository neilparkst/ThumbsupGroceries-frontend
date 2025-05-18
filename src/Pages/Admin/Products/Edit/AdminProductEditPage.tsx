import React from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import NotFoundPage from '../../../NotFoundPage';
import Card from '../../../../Components/Card';
import ProductDetailInputForm from '../Components/ProductDetailInputForm';
import { useParams } from 'react-router-dom';

const AdminProductEditPage = () => {
    const userRole = useSelector((state: GlobalState) => state.user.info?.role);

    const params = useParams();
    const productId = params.productId ? parseInt(params.productId) : undefined;

    if(!userRole || userRole !== 'Admin'){
        return <NotFoundPage />;
    }

    return (
        <div className='AdminProductEditPage'>
            <Card title='Edit Product' maxWidth={1000}>
                <ProductDetailInputForm editProductId={productId} />
            </Card>
        </div>
    );
};

export default AdminProductEditPage;