import React, { ReactNode } from 'react';
import './Styles/Card.scss';

const Card = ({title, children}: {title?: string, children: ReactNode}) => {
    return (
        <div className='Card'>
            {title && <CardTitle>{title}</CardTitle>}
            {children}
        </div>
    );
};

const CardTitle = ({children}: {children: ReactNode}) => {
    return(
        <h2 className='CardTitle'>
            {children}
        </h2>
    )
}

export default Card;