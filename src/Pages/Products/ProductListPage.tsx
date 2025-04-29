import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ProductListPage.scss';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryTree, getCategoryTree } from '../../Data/ProductData';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getCategoryNameById, getTreePath } from '../../Data/Util';

const ProductListPage = () => {
    const params = useParams();
    const categoryId = parseInt(params.categoryId || '0');

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
        return getCategoryNameById(categoryTree, categoryId);
    }, [categoryId, categoryTree])

    return (
        <div className='ProductListPage'>
            <div className="CategoryListContainer">
                <CategoryList
                    key={categoryId}
                    categoryTree={categoryTree}
                    initialCategoryId={categoryId}
                />
            </div>
            <div className="ProductListContainer">
                <div className="CategoryName">
                    {categoryName}
                </div>
                <div className="SearchAndSort">

                </div>
                <div className="ProductList">
                    <div className="ProductCardContainer">

                    </div>
                    <div className="PageNavigation">

                    </div>
                </div>
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

export default ProductListPage;