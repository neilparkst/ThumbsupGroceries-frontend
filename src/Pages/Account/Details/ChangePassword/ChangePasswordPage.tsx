import React, { FormEvent, useState } from 'react';
import './ChangePasswordPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateMyPassword } from '../../../../Data/UserData';
import { GlobalState } from '../../../../Data/GlobalState/Store';
import { Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { registerTokenAndUserInfo } from '../../../../Data/GlobalState/UserSlice';
import Card from '../../../../Components/Card';

const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const token = useSelector((state: GlobalState) => state.user.token);
    const dispatch = useDispatch();

    const [ oldPassword, setOldPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(token){
            const response = await updateMyPassword({oldPassword, newPassword}, token);
            if('errorMessage' in response){
                toast.error(response.errorMessage);
                return;
            }
    
            dispatch(registerTokenAndUserInfo(response.token));
            sessionStorage.setItem("token", response.token);

            toast.success("Changed password successfully!");
    
            navigate('/account/details');
        }
    }

    return (
        <div className='ChangePasswordPage'>
            <Card title='Change Password'>
                <form className='ChangePasswordForm' onSubmit={(e) => handleSubmit(e)}>
                    <TextField
                        type='password'
                        label='Old Password'
                        required
                        value={oldPassword}
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                        }}
                    />
                    <TextField
                        type='password'
                        label='New Password'
                        required
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Change Password
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;