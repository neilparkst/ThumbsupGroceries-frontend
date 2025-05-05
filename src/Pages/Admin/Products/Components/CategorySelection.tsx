import React from 'react';
import './CategorySelection.scss';
import { CategoryTree, getCategoryTree } from '../../../../Data/ProductData';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategorySelection = (
    {
        selectedCategories,
        onSelectedCategoriesChange
    } : {
        selectedCategories: (number | '')[],
        onSelectedCategoriesChange: (newSelectedCategories: (number | '')[]) => void
    }
) => {
    const { data: categoryTree, isError } = useQuery({
        queryKey: ['categoryTree'],
        queryFn: async () => {
            const response = await getCategoryTree();
            if('errorMessage' in response){
                throw new Error(response.errorMessage);
            }

            return response as CategoryTree;
        }
    })

    let categoryTreeLevels = [categoryTree];
    for(let i = 1; i <= 2; i++){
        const newTreeLevel = categoryTreeLevels[i-1]?.find(categoryItem => categoryItem.categoryId === selectedCategories[i-1])?.children;
        if(newTreeLevel){
            categoryTreeLevels.push(newTreeLevel);
        }
    }

    if(isError){
        toast.error("Error occurred while getting category tree!");
    }

    return (
        <div className='CategorySelection'>
            <FormControl fullWidth>
                <InputLabel id="category1">Category 1</InputLabel>
                <Select
                    labelId="category1"
                    id="category-selection1"
                    value={selectedCategories[0].toString()}
                    label="Category1"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([Number.parseFloat(event.target.value), '', ''])
                    }}
                    required
                >
                    {categoryTreeLevels[0]?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="category2">Category 2</InputLabel>
                <Select
                    labelId="category2"
                    id="category-selection2"
                    value={selectedCategories[1].toString()}
                    label="Category2"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([selectedCategories[0], Number.parseFloat(event.target.value), ''])
                    }}
                >
                    {categoryTreeLevels[1]?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="category3">Category 3</InputLabel>
                <Select
                    labelId="category3"
                    id="category-selection3"
                    value={selectedCategories[2].toString()}
                    label="Category3"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([selectedCategories[0], selectedCategories[1], Number.parseFloat(event.target.value)])
                    }}
                >
                    {categoryTreeLevels[2]?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ToastContainer />
        </div>
    );
};

export default CategorySelection;