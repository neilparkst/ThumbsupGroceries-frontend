import React from 'react';
import './CategorySelection.scss';
import { CategoryTree, getCategoryTree } from '../../../../Data/ProductData';
import { isErrorMessage } from '../../../../Data/Util';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../../../../Data/Settings';
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
    const selectedCategoryId1 = selectedCategories[0];
    const selectedCategoryId2 = selectedCategories[1];
    const selectedCategoryId3 = selectedCategories[2];

    const { data: categoryTree, isError } = useQuery({
        queryKey: ['categoryTree'],
        queryFn: async () => {
            const response = await getCategoryTree();
            if(isErrorMessage(response)){
                throw new Error((response as ErrorMessage).errorMessage);
            }

            return response as CategoryTree;
        }
    })
    const categoryTreeLevel1 = categoryTree;
    const categoryTreeLevel2 = categoryTreeLevel1?.find(categoryItem => categoryItem.categoryId === selectedCategoryId1)?.children
    const categoryTreeLevel3 = categoryTreeLevel2?.find(categoryItem => categoryItem.categoryId === selectedCategoryId2)?.children

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
                    value={selectedCategoryId1.toString()}
                    label="Category1"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([Number.parseFloat(event.target.value), '', ''])
                    }}
                    required
                >
                    {categoryTreeLevel1?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="category2">Category 2</InputLabel>
                <Select
                    labelId="category2"
                    id="category-selection2"
                    value={selectedCategoryId2.toString()}
                    label="Category2"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([selectedCategoryId1, Number.parseFloat(event.target.value), ''])
                    }}
                >
                    {categoryTreeLevel2?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="category3">Category 3</InputLabel>
                <Select
                    labelId="category3"
                    id="category-selection3"
                    value={selectedCategoryId3.toString()}
                    label="Category3"
                    onChange={(event: SelectChangeEvent) => {
                        onSelectedCategoriesChange([selectedCategoryId1, selectedCategoryId2, Number.parseFloat(event.target.value)])
                    }}
                >
                    {categoryTreeLevel3?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ToastContainer />
        </div>
    );
};

export default CategorySelection;