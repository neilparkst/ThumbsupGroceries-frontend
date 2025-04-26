import React, { ReactNode } from 'react';
import './SignUpPage.scss';
import { Box, Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Card from '../../Components/Card';
import { signUp, SignUpResponse } from '../../Data/AuthData';
import { isErrorMessage } from '../../Data/Util';
import { ErrorMessage } from '../../Data/Settings';

const SignUpPage = () => {
    const navigate = useNavigate();

    const { handleSubmit, control, formState: {errors} } = useForm({mode: 'onBlur'});

    const onSubmit = async (formData: any) => {
        const response = await signUp(formData);
        if(isErrorMessage(response)){
            alert((response as ErrorMessage).errorMessage);
            return;
        }

        const email = (response as SignUpResponse).email;
        alert(`${email} has been signed up succesfully!`);

        navigate('/signin');
    };

    return (
        <div className='SignUpPage'>
            <Card title='Sign Up'>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className='SignUpForm'
                >
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Entered value does not match email format"
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label='Email'
                                error={!!errors.email}
                                helperText={errors.email?.message as ReactNode}
                            />
                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        defaultValue=''
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type='password'
                                label='Password'
                                error={!!errors.password}
                                helperText={errors.password?.message as ReactNode}
                            />
                        )}
                    />
                    <Controller
                        name='userName'
                        control={control}
                        defaultValue=''
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
                            defaultValue=''
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
                            defaultValue=''
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
                        defaultValue=''
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
                        defaultValue=''
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
                        Sign Up
                    </Button>
                </Box>
            </Card>
        </div>
    );
};

export default SignUpPage;