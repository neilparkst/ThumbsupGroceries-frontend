import React from 'react';
import Card from '../../../../Components/Card';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import NotFoundPage from '../../../NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailInputForm from '../Components/ProductDetailInputForm';

const AdminProductAddPage = () => {
    const userRole = useSelector((state: GlobalState) => state.user.info?.role);

    if(!userRole || userRole !== 'Admin'){
        return <NotFoundPage />;
    }

    return (
        <div className='AdminProductAddPage'>
            <Card title='Add Product' maxWidth={1000}>
                <ProductDetailInputForm />
            </Card>
        </div>
    );
};

export default AdminProductAddPage;