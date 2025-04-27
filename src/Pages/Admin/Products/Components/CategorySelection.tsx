import React, { useEffect, useState } from 'react';
import './CategorySelection.scss';
import { CategoryTree, getCategoryTree } from '../../../../Data/ProductData';
import { isErrorMessage } from '../../../../Data/Util';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

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

    const [ categoryOptionLists, setCategoryOptionLists ] = useState<(CategoryTree | null)[]>([null, null, null]);

    useEffect(() => {
        const getCategories = async () => {
            const response = await getCategoryTree();
            if(isErrorMessage(response)){
                alert('Error occurred during getting category tree!');
                return;
            }
            
            const newCategoryTree = response as CategoryTree;
            setCategoryOptionLists([
                newCategoryTree,
                null,
                null
            ])
        }

        getCategories();
    }, [])

    useEffect(() => {
        setCategoryOptionLists(prev => ([
            prev[0],
            prev[0]?.find(categoryItem => categoryItem.categoryId === selectedCategoryId1)?.children ?? null,
            null
        ]))
    }, [selectedCategoryId1])

    useEffect(() => {
        setCategoryOptionLists(prev => ([
            prev[0],
            prev[1],
            prev[1]?.find(categoryItem => categoryItem.categoryId === selectedCategoryId2)?.children ?? null
        ]))
    }, [selectedCategoryId2])


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
                    {categoryOptionLists[0]?.map(categoryList => (
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
                    {categoryOptionLists[1]?.map(categoryList => (
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
                    {categoryOptionLists[2]?.map(categoryList => (
                        <MenuItem key={categoryList.categoryId} value={categoryList.categoryId} >{categoryList.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default CategorySelection;