import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import './ProductListPage.scss';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CategoryTree, getCategoryTree, getProducts, ProductSimple } from '../../Data/ProductData';
import { Box, Divider, FormControl, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, MenuItem, Pagination, Select, SelectChangeEvent, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getCategoryNameById, getTreePath } from '../../Data/Util';
import ProductCard from '../../Components/ProductCard';

const ProductListPage = () => {
    const params = useParams();
    const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined;

    const [ searchParams ] = useSearchParams();
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');

    const navigate = useNavigate();

    const { data: categoryTree } = useQuery({
        queryKey: ['categoryTree'],
        queryFn: async () => {
            const response = await getCategoryTree();
            if('errorMessage' in response){
                throw new Error(response.errorMessage);
            }
            return response as CategoryTree;
        }
    })
    const categoryTreeLengthRef = useRef(0);

    const categoryName = useMemo(() => {
        if((categoryTree?.length || 0 ) === categoryTreeLengthRef.current){
            return;
        }
        return getCategoryNameById(categoryTree, categoryId || 0);
    }, [categoryId, categoryTree])

    return (
        <div className='ProductListPage'>
            <div className="CategoryListContainer">
                <CategoryList
                    key={categoryId}
                    categoryTree={categoryTree}
                    initialCategoryId={categoryId || 0}
                />
            </div>
            <div className="ProductListContainer">
                <div className="CategoryName">
                    {categoryName}
                </div>
                <div className="SearchAndSort">
                    <Box
                        className='SearchBar'
                        component='form'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const data = new FormData(e.currentTarget);
                            const search = data.get('search');

                            navigate(`/products/categories/${categoryId}?search=${search}`);
                        }}
                        style={{
                            visibility: !categoryId ? 'hidden' : 'initial'
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
                    <div className="SortContainer">
                        <span>Sort By</span>
                        <FormControl size='small'>
                            <Select
                                id="sortMethod-selection"
                                value={sort || 'relevance'}
                                onChange={(event: SelectChangeEvent) => {
                                    const newSort = event.target.value;
                                    let currentUrl = new URL(window.location.href);

                                    [{search}, {sort: newSort}, {page}, {pageSize}].forEach(item => {
                                        const [[key, value]] = Object.entries(item);
                                        if(value){
                                            currentUrl.searchParams.set(key, value);
                                        }
                                    })

                                    navigate(currentUrl.pathname + currentUrl.search);
                                }}
                            >
                                {[{name: 'Relevance', value: 'relevance'}, {name: 'Low Price', value: 'priceLow'}, {name: 'High Price', value: 'priceHigh'}].map(sortMethod => (
                                    <MenuItem key={sortMethod.value} value={sortMethod.value} >{sortMethod.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <ProductList
                    categoryId={categoryId}
                    search={search || undefined}
                    sort={sort || undefined}
                    page={page}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

const CategoryList = ({categoryTree, initialCategoryId} : {categoryTree: CategoryTree | undefined, initialCategoryId: number}) => {
    const navigate = useNavigate();

    const [ selectedCategories, setSelectedCategories ] = useState<number[]>([]);
    const [ currentCategoryLevel, setCurrentCategoryLevel ] = useState(0);
    const categoryTreeLengthRef = useRef(0);
    
    useEffect(() => {
        if((categoryTree?.length || 0 ) === categoryTreeLengthRef.current){
            return;
        }
        const path = getTreePath(categoryTree, initialCategoryId);
        setSelectedCategories(path);
        setCurrentCategoryLevel(Math.max(Math.min(path.length - 1, 2), 0));
    }, [categoryTree, initialCategoryId])

    if(!categoryTree){
        return null;
    }

    let categoryTreeLevels = [categoryTree];
    for(let i = 1; i <= 2; i++){
        const newTreeLevel = categoryTreeLevels[i-1]?.find(categoryItem => categoryItem.categoryId === selectedCategories[i-1])?.children;
        if(newTreeLevel){
            categoryTreeLevels.push(newTreeLevel);
        }
    }
    const currentCategory = categoryTreeLevels[currentCategoryLevel - 1]?.find(categoryItem => categoryItem.categoryId === selectedCategories[currentCategoryLevel - 1]);

    return (
        <Box>
            <List 
                dense
                subheader="Categories"
                className='CategoryList'
            >
                <div style={{height: 20}}></div>
                {currentCategoryLevel > 0 &&<>
                    <ListItem
                        onClick={() =>{
                            setSelectedCategories(prev => prev.slice(0, -1));
                            setCurrentCategoryLevel(prev => prev - 1);
                        }}
                    >
                        <ListItemIcon sx={{minWidth: 40, color: '#1976d2'}}>
                            <ArrowBackIosNewIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Back"
                            sx={{color: '#1976d2'}}
                            slotProps={{
                                primary: {
                                    fontSize: 18
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            navigate(`/products/categories/${currentCategory?.categoryId}`);
                        }}
                    >
                        <ListItemText 
                            primary={`All ${currentCategory?.name}`}
                            sx={{color: '#63a4ff'}}
                            slotProps={{
                                primary: {
                                    fontSize: 16
                                }
                            }}
                        />
                    </ListItem>
                    <Divider />
                </>}
                {categoryTreeLevels[currentCategoryLevel]?.map(categoryItem => (
                    <ListItem
                        key={categoryItem.categoryId}
                        onClick={() => {
                            if(currentCategoryLevel < 2){
                                setSelectedCategories(prev => [...prev, categoryItem.categoryId]);
                                setCurrentCategoryLevel(prev => prev + 1);
                            } else{
                                setSelectedCategories([]);
                                setCurrentCategoryLevel(0);
                                navigate(`/products/categories/${categoryItem.categoryId}`);
                            }
                        }}
                        className='Item'
                    >
                        <ListItemText primary={categoryItem.name} />
                    </ListItem>)
                )}
            </List>
        </Box>
    )
}

const ProductList = ({categoryId, search, sort, page, pageSize} : {categoryId?: number, search?: string, sort?: string, page?: number, pageSize?: number}) => {
    const navigate = useNavigate();
    
    const {data: products} = useQuery({
        queryKey: ['products', {categoryId: categoryId, sort: sort, search: search, page: page, pageSize: pageSize}],
        queryFn: async () => {
            const response = await getProducts(categoryId, sort, search, page, pageSize);
            if('errorMessage' in response){
                throw new Error(response.errorMessage);
            }

            return response as ProductSimple[];
        }
    })

    if(products && products.length === 0){
        return(
            <div className='NoProduct'>
                No Products
            </div>
        )
    }
    
    return(
        <div className="ProductList">
            <div className="ProductCardContainer">
                {products?.map(product => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
            <div className="Pagination">
                <Pagination
                    count={Math.ceil((products?.length || 0) / (pageSize || 24))}
                    page={page}
                    onChange={(event: ChangeEvent<unknown>, value) => {
                        const newPage = value;

                        let currentUrl = new URL(window.location.href);

                        [{search}, {sort}, {page: newPage}, {pageSize}].forEach(item => {
                            const [[key, value]] = Object.entries(item);
                            if(value){
                                currentUrl.searchParams.set(key, value);
                            }
                        })

                        navigate(currentUrl.pathname + currentUrl.search);
                    }}
                />
            </div>
        </div>
    )
}

export default ProductListPage;