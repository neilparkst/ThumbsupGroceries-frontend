import React, { ReactNode } from 'react';
import './Styles/Card.scss';

const Card = ({title, children, maxWidth = 500}: {title?: string, children: ReactNode, maxWidth?: number}) => {
    return (
        <div className='Card' style={{maxWidth: `${maxWidth}px`}}>
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