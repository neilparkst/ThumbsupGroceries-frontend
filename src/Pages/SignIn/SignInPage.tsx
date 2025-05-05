import React, { FormEvent, useState } from 'react';
import Card from '../../Components/Card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

import './SignInPage.scss';
import { signIn, SignInResponse } from '../../Data/AuthData';
import { useDispatch } from 'react-redux';
import { registerTokenAndUserInfo } from '../../Data/GlobalState/UserSlice';
import { toast } from 'react-toastify';

const SignInPage = () => {
    const [ searchParams ] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '';
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const response = await signIn({email, password});
        if('errorMessage' in response){
            toast.error(response.errorMessage);
            return;
        }

        const token = (response as SignInResponse).token;
        dispatch(registerTokenAndUserInfo(token));

        navigate('/' + (redirectTo ? redirectTo : ''));
    }

    return (
        <div className='SignInPage'>
            <Card title='sign in'>
                <form className='SignInForm' onSubmit={(e) => handleSubmit(e)}>
                    <TextField
                        label='Email'
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        type='password'
                        label='Password'
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default SignInPage;