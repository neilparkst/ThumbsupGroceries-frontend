import React, { ReactNode, useEffect, useState } from 'react';
import './ProductDetailInputForm.scss';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import CategorySelection from '../Components/CategorySelection';
import ImageDragAndDropUploader from '../../../../Components/ImageDragAndDropUploader';
import { addProduct, getProduct, Product, ProductAddRequest, ProductUpdateRequest, updateProduct } from '../../../../Data/ProductData';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import LoadingCircle from '../../../../Components/LoadingCircle';
import { loadImages } from '../../../../Data/Util';
import { useNavigate } from 'react-router-dom';

const ProductDetailInputForm = ({editProductId} : {editProductId?: number}) => {
    const navigate = useNavigate();

    const token = useSelector((state: GlobalState) => state.user.token);

    const { handleSubmit, control, reset, formState: {errors}, getValues, watch } = useForm({
        mode: 'onBlur',
    });
    const watchAddedQuantity = watch("addedQuantity");

    const [ product, setProduct ] = useState<Product | null>(null);
    const [ productImages, setProductImages ] = useState<File[]>([]);

    const onSubmit = async (data: any) => {
        if(token){
            let response;
            if(editProductId){
                const formData = data as ProductUpdateRequest;
                if(formData.categories){
                    formData.categories = formData.categories.filter(category => (category as (number | '')) !== '')
                }
                if(getValues('addedQuantity')){
                    formData.quantity = null;
                }
                response = await updateProduct(editProductId, formData, token);
                if('errorMessage' in response){
                    toast.error(response.errorMessage);
                    return;
                }
                toast.success("product edited succesfully");
                navigate(`/products/${editProductId}`);
            } else{
                const formData = data as ProductAddRequest;
                formData.categories = formData.categories.filter(category => (category as (number | '')) !== '')
                response = await addProduct(formData, token);
                if('errorMessage' in response){
                    toast.error(response.errorMessage);
                    return;
                }
                toast.success("product added succesfully");
                reset({priceUnitType: 'ea'});
            }

        } else{
            console.log("token doesn't exist");
        }
    }

    const [ isLoading, setIsLoading ] = useState(false);
    useEffect(() => {
        const getProductInfo = async () => {
            if(!editProductId || isNaN(editProductId)){
                return;
            }
            setIsLoading(true);
            const response = await getProduct(editProductId);
            setIsLoading(false);
            if('errorMessage' in response){
                toast.error(response.errorMessage);
                return;
            }

            const productImageFiles = await loadImages(response.images);
            setProduct(response);
            setProductImages(productImageFiles);
        }

        getProductInfo();

    }, [editProductId])

    if(editProductId && !product){
        return <LoadingCircle isOpen={isLoading} />;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            className='ProductDetailInputForm'
        >
            <Controller
                name='categories'
                defaultValue={product?.categories || ['', '', '']}
                control={control}
                rules={{required: 'At least one category is required'}}
                render={({ field: { value, onChange } }) => (
                    <CategorySelection selectedCategories={value} onSelectedCategoriesChange={onChange} />
                )}
            />
            <Controller
                name='name'
                control={control}
                defaultValue={product?.name || ''}
                rules={{required: 'Name is required'}}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label='Name'
                        required
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message as ReactNode}
                    />
                )}
            />
            <div className="Group">
                <Controller
                    name='quantity'
                    control={control}
                    defaultValue={product?.quantity || ''}
                    rules={{required: 'Quantity is required'}}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type='number'
                            label='Quantity'
                            disabled={watchAddedQuantity && watchAddedQuantity !== '0'}
                            slotProps={{
                                htmlInput: {
                                    min: 1
                                }
                            }}
                            required
                            fullWidth
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message as ReactNode}
                        />
                    )}
                />
                {editProductId &&
                    <Controller
                        name='addedQuantity'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type='number'
                                label='addedQuantity'
                                fullWidth
                                error={!!errors.quantity}
                                helperText={errors.quantity?.message as ReactNode}
                            />
                        )}
                    />
                }
                <Controller
                    name='price'
                    control={control}
                    defaultValue={product?.price || ''}
                    rules={{required: 'Price is required'}}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type='number'
                            label='Price'
                            required
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price?.message as ReactNode}
                        />
                    )}
                />
                <FormControl fullWidth>
                    <InputLabel id="priceUnitType">Price Unit Type</InputLabel>
                    <Controller
                        name="priceUnitType"
                        control={control}
                        defaultValue="ea"
                        rules={{ required: 'Price Unit Type is required' }}
                        render={({ field }) => (
                            <Select {...field} labelId="priceUnitType" label="Price Unit Type">
                                <MenuItem value={'ea'}>ea</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
            </div>
            <Controller
                name='description'
                control={control}
                defaultValue={product?.description || ''}
                render={({ field }) => (
                    <TextField
                        {...field}
                        multiline
                        label='Description'
                        fullWidth
                    />
                )}
            />
            <Controller
                control={control}
                name="images"
                defaultValue={productImages}
                render={({ field: { value, onChange } }) => (
                    <div>
                        <ImageDragAndDropUploader images={value || productImages} onImagesChange={onChange} />
                        {(value && (value as any[]).length > 0) &&
                            <FormHelperText>{"The first image will be used as the representative image"}</FormHelperText>
                        }
                    </div>
                )}
            />
            <Button
                type='submit'
                variant='contained'
            >
                {editProductId ? 'Edit' : 'Add'}
            </Button>
        </Box>
    );
};

export default ProductDetailInputForm;