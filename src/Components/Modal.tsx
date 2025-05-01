import React, { ReactNode } from 'react';
import MuiModal from '@mui/material/Modal';
import Card from './Card';

const Modal = ({isOpen, handleClose, children}: {isOpen: boolean, handleClose: () => void, children: ReactNode}) => {
    return (
        <MuiModal
            open={isOpen}
            onClose={handleClose}
        >
            <Card maxWidth={300}>
                {children}
            </Card>
      </MuiModal>
    );
};

export default Modal;