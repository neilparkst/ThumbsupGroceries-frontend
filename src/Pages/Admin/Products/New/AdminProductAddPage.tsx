import React, { ReactNode } from 'react';
import './AdminProductAddPage.scss';
import Card from '../../../../Components/Card';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import CategorySelection from '../Components/CategorySelection';
import ImageDragAndDropUploader from '../../../../Components/ImageDragAndDropUploader';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import { addProduct, ProductAddRequest } from '../../../../Data/ProductData';
import NotFoundPage from '../../../NotFoundPage';
import { isErrorMessage } from '../../../../Data/Util';
import { ErrorMessage } from '../../../../Data/Settings';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProductAddPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);
    const userRole = useSelector((state: GlobalState) => state.user.info?.role);

    const { handleSubmit, control, reset, formState: {errors} } = useForm({
        mode: 'onBlur',
    });

    const onSubmit = async (data: any) => {
        const formData = data as ProductAddRequest;
        formData.categories = formData.categories.filter(category => (category as (number | '')) !== '')

        if(token){
            const response = await addProduct(formData, token);
            if(isErrorMessage(response)){
                toast.error((response as ErrorMessage).errorMessage);
                return;
            }

            toast.success("product added succesfully");
            reset();
        } else{
            console.log("token doesn't exist");
        }
    }

    if(!userRole || userRole !== 'Admin'){
        return <NotFoundPage />;
    }

    return (
        <div className='AdminProductAddPage'>
            <Card title='Add Product' maxWidth={1000}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className='AdminProductAddForm'
                >
                    <Controller
                        name='categories'
                        control={control}
                        rules={{required: 'At least one category is required'}}
                        render={({ field: { value, onChange } }) => (
                            <CategorySelection selectedCategories={value || ['', '', '']} onSelectedCategoriesChange={onChange} />
                        )}
                    />
                    <Controller
                        name='name'
                        control={control}
                        defaultValue=''
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
                            defaultValue=''
                            rules={{required: 'Quantity is required'}}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='number'
                                    label='Quantity'
                                    required
                                    fullWidth
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message as ReactNode}
                                />
                            )}
                        />
                        <Controller
                            name='price'
                            control={control}
                            defaultValue=''
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
                        defaultValue=''
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
                        render={({ field: { value, onChange } }) => (
                            <div>
                                <ImageDragAndDropUploader images={value || []} onImagesChange={onChange} />
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
                        Add
                    </Button>
                </Box>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default AdminProductAddPage;