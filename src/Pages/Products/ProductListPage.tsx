import React, { useEffect, useRef, useState } from 'react';
import './ProductListPage.scss';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryTree, getCategoryTree } from '../../Data/ProductData';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ProductListPage = () => {
    const params = useParams();
    const categoryId = parseInt(params.categoryId || '0');

    return (
        <div className='ProductListPage'>
            <div className="CategoryListContainer">
                <CategoryList initialCategoryId={categoryId} />
            </div>
            <div className="ProductListContainer">
                <div className="CategoryName">

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

const getTreePath = (tree: CategoryTree | undefined, id: number): number[] => {
    if(!tree){
        return [];
    }
    let path: number[] = [];
    for(let i = 0; i < tree.length; i++){
        let currentRoot = tree[i];
        path.push(currentRoot.categoryId);
        if(currentRoot.categoryId === id){
            return path;
        }
        const nextPaths = getTreePath(currentRoot.children, id);
        if(nextPaths.length > 0){
            path = path.concat(nextPaths);
            break;
        }
        path.pop();
    }
    return path;
}

const CategoryList = ({initialCategoryId} : {initialCategoryId: number}) => {
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

    const [ selectedCategories, setSelectedCategories ] = useState<number[]>([]);
    const [ currentCategoryLevel, setCurrentCategoryLevel ] = useState(0);
    const categoryTreeLength = useRef(0);
    
    useEffect(() => {
        if((categoryTree?.length || 0 ) === categoryTreeLength.current){
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