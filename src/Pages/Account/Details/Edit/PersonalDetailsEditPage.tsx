import React, { ReactNode, useEffect, useState } from 'react';
import './PersonalDetailsEditPage.scss';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, updateMyInfo, UserInfoType } from '../../../../Data/UserData';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import { toast } from 'react-toastify';
import Card from '../../../../Components/Card';
import { Box, Button, TextField } from '@mui/material';
import LoadingCircle from '../../../../Components/LoadingCircle';

const PersonalDetailsEditPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);
    const navigate = useNavigate();

    const { handleSubmit, control, formState: {errors} } = useForm({mode: 'onBlur'});

    const [userInfo, setUserInfo] = useState<UserInfoType>();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCurrentUserInfo = async () => {
            if(token){
                setIsLoading(true);
                const response = await getMyInfo(token);
                setIsLoading(false);
                if('errorMessage' in response){
                    toast.error('Could not load my info');
                    return;
                }
                setUserInfo(response);
            }
        }

        getCurrentUserInfo();
    }, [token])

    const onSubmit = async (formData: any) => {
        if(token){
            const response = await updateMyInfo(formData, token);
            if('errorMessage' in response){
                toast.error(response.errorMessage);
                return;
            }

            toast.success("Updated Info successfully!");
    
            navigate('/account/details');
        }
    };

    if(!userInfo){
        return <LoadingCircle isOpen={isLoading} />;
    }

    return (
        <div className='PersonalDetailsEditPage'>
            <Card title='Edit Info'>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className='PersonalDetailsEditForm'
                >
                    <Controller
                        name='userName'
                        control={control}
                        defaultValue={userInfo.userName || ''}
                        rules={{ required: 'UserName is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='User Name'
                                error={!!errors.userName}
                                helperText={errors.userName?.message as ReactNode}
                            />
                        )}
                    />
                    <div className='Name'>
                        <Controller
                            name='firstName'
                            control={control}
                            defaultValue={userInfo.firstName || ''}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='First Name'
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name='lastName'
                            control={control}
                            defaultValue={userInfo.lastname || ''}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Last Name'
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name='phoneNumber'
                        control={control}
                        defaultValue={userInfo.phoneNumber || ''}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Phone Number'
                            />
                        )}
                    />
                    <Controller
                        name='address'
                        control={control}
                        defaultValue={userInfo.address || ''}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Address'
                            />
                        )}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Edit
                    </Button>
                </Box>
            </Card>
        </div>
    );
};

export default PersonalDetailsEditPage;