import React from 'react';
import { useNavigate } from 'react-router-dom';

function ActionButtons({ to, onClick, children, className = '', variant = 'primary' }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            console.log(`Navigating to: ${to}`);
            navigate(to);
        }
        if (onClick) {
            console.log('Executing custom onClick handler');
            onClick();
        }
    };

    const baseStyles = 'cursor-pointer rounded-xl px-6 py-3 text-2xl font-semibold text-white shadow-md transition duration-300';
    const variantStyles =
        variant === 'primary'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-600 hover:bg-gray-700';

    return (
        <button
            onClick={handleClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </button>
    );
}

export default ActionButtons;