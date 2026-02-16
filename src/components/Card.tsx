import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass';
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hover = true,
    className = '',
    onClick,
}) => {
    const classes = [
        'card-component',
        `card-${variant}`,
        hover ? 'card-hover' : '',
        onClick ? 'card-clickable' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};
