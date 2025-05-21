import React, { ChangeEvent, useState } from 'react';
import './AdminProductListPage.scss';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CategorySelection from './Components/CategorySelection';
import { Box, Button, IconButton, InputAdornment, Pagination, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { getProducts, ProductSimple } from '../../../Data/ProductData';
import LoadingCircle from '../../../Components/LoadingCircle';
import { domain } from '../../../Data/Settings';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import NotFoundPage from '../../NotFoundPage';

const AdminProductListPage = () => {
    const userRole = useSelector((state: GlobalState) => state.user.info?.role);

    const params = useParams();
    const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined;

    const [ searchParams ] = useSearchParams();
    const search = searchParams.get('search') ?? undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const navigate = useNavigate();

    const {data: products, isLoading} = useQuery({
        queryKey: ['products', {categoryId: categoryId, sort: 'relevance', search: search, page: page, pageSize: pageSize}],
        queryFn: async () => {
            const response = await getProducts(categoryId, 'relevance', search, page, pageSize);
            if('errorMessage' in response){
                throw new Error(response.errorMessage);
            }

            return response as ProductSimple[];
        }
    })

    const [selectedCategories, setSelectedCategories] = useState<(number | '')[]>(['', '', '']);

    if(!userRole || userRole !== 'Admin'){
        return <NotFoundPage />;
    }


    return (
        <div className='AdminProductListPage'>
            <div className="CategorySelectionContainer">
                <CategorySelection
                    selectedCategories={selectedCategories}
                    onSelectedCategoriesChange={(newSelectedCategories) => setSelectedCategories(newSelectedCategories)}
                />
                <Button
                    variant='contained'
                    onClick={() => {
                        let selectedCategoryId: number | undefined;
                        selectedCategories.forEach(category => {
                            if(category !== ''){
                                selectedCategoryId = category;
                            }
                        })
                        if(!selectedCategoryId){
                            return;
                        }

                        if(search){
                            navigate(`/admin/products/categories/${selectedCategoryId}?search=${search}`);
                        } else{
                            navigate(`/admin/products/categories/${selectedCategoryId}`);
                        }
                    }}
                >
                    OK
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        setSelectedCategories(['', '', '']);
                        if(search){
                            navigate(`/admin/products?search=${search}`);
                        } else{
                            navigate(`/admin/products`);
                        }
                    }}
                >
                    Reset
                </Button>
            </div>
            <Box
                className='SearchBar'
                component='form'
                onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    const newSearch = data.get('search');

                    if(categoryId){
                        navigate(`/admin/products/categories/${categoryId}?search=${newSearch}`);
                    } else{
                        navigate(`/admin/products?search=${newSearch}`);
                    }
                }}
            >
                <TextField
                    name='search'
                    placeholder='In this category...'
                    variant='standard'
                    fullWidth
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton type="submit" edge="end">
                                        <SearchIcon sx={{ color: '#1976d2' }} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </Box>
            <div className="Buttons">
                <Link to='new'>
                    <Button
                        variant='contained'
                    >
                        Add Product
                    </Button>
                </Link>
            </div>
            <div className="ProductList">
                <table>
                    <thead>
                        <tr>
                            <td>Product Id</td>
                            <td>Name</td>
                            <td>Image</td>
                            <td>Price</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map(product => (
                            <tr>
                                <td>
                                    <Link to={`/products/${product.productId}`}>
                                        {product.productId}
                                    </Link>
                                </td>
                                <td>{product.name}</td>
                                <td>
                                    {product.image ?
                                        <img src={`${domain}${product.image}`} alt={product.name} />:
                                        <img src="/no_image.avif" alt="no img" />
                                    }
                                </td>
                                <td>${(product.price / 100).toFixed(2)} / {product.priceUnitType}</td>
                                <td>
                                    <Link to={`edit/${product.productId}`}>
                                        <Button variant='contained'>
                                            Edit
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="Pagination">
                <Pagination
                    count={Math.ceil((products?.length || 0) / (pageSize || 24))}
                    page={page}
                    onChange={(event: ChangeEvent<unknown>, value) => {
                        const newPage = value;

                        let currentUrl = new URL(window.location.href);

                        [{search}, {page: newPage}, {pageSize}].forEach(item => {
                            const [[key, value]] = Object.entries(item);
                            if(value){
                                currentUrl.searchParams.set(key, value);
                            }
                        })

                        navigate(currentUrl.pathname + currentUrl.search);
                    }}
                />
            </div>
            <LoadingCircle isOpen={isLoading} />
        </div>
    );
};

export default AdminProductListPage;