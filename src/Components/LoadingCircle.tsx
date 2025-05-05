import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingCircle = ({isOpen, isLocal} : {isOpen: boolean, isLocal?: boolean}) => {
    if(isLocal && isOpen){
        return <CircularProgress />
    }

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isOpen}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingCircle;