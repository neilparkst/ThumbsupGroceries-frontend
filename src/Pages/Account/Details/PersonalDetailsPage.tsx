import React, { useEffect, useState } from 'react';
import './PersonalDetailsPage.scss';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../../Data/GlobalState/Store';
import { deleteMyAccount, getMyInfo, UserInfoType } from '../../../Data/UserData';
import { toast } from 'react-toastify';
import LoadingCircle from '../../../Components/LoadingCircle';
import { Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../Components/Card';
import Modal from '../../../Components/Modal';

const PersonalDetailsPage = () => {
    const token = useSelector((state: GlobalState) => state.user.token);
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<UserInfoType>();

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    
    if(!token){
        return(
            <div className='PersonalDetailsPage'>
                <Card title='Details'>
                    {null}
                </Card>
            </div>
        )
    }
    
    if(userInfo === undefined){
        return(
            <LoadingCircle isOpen={isLoading} />
        );
    }

    const isAccountDeletable = false;
    return (
        <div className='PersonalDetailsPage'>
            <Card title='Details'>
                <table className='UserInfoTable'>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td>{userInfo.email}</td>
                        </tr>
                        <tr>
                            <td>User Name</td>
                            <td>{userInfo.userName}</td>
                        </tr>
                        <tr>
                            <td>First Name</td>
                            <td>{userInfo.firstName}</td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>{userInfo.lastname}</td>
                        </tr>
                        <tr>
                            <td>Phone Number</td>
                            <td>{userInfo.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{userInfo.address}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="Buttons">
                    <Link to='edit'>
                        <Button>
                            Edit Info
                        </Button>
                    </Link>
                    <Link to='change-password'>
                        <Button>
                            Change Password
                        </Button>
                    </Link>
                    {isAccountDeletable &&
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        Delete Account
                    </Button>}
                </div>
            </Card>
            {isAccountDeletable &&
            <Modal isOpen={isModalOpen} handleClose={() => {setIsModalOpen(false);}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '20px', textAlign: 'center', marginTop: '30px'}}>
                    <span>
                        Do you really want to delete your account?
                    </span>
                    <Box sx={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={async () => {
                                const response = await deleteMyAccount(token);
                                if('errorMessage' in response){
                                    toast.error(response.errorMessage);
                                    return;
                                }

                                setIsModalOpen(false);
                                navigate('/');
                                sessionStorage.removeItem("token");
                                window.location.reload();
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setIsModalOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </div>
            </Modal>}
        </div>
    );
};

export default PersonalDetailsPage;