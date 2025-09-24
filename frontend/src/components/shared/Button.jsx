import React from 'react';

const DETAULT_STYLE = "w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
const DEFAUL_PROPS = {
    id: '',
    type: 'button',
    text: 'CLICK ME',
    name: 'button',
}

export const Button = ({ id, type, name, text, onClick } = DEFAUL_PROPS) => {
    return (
        <button
            id={id}
            name={name}
            type={type}
            onClick={onClick}
            className={DETAULT_STYLE}
        >
            {text}
        </button>
    );
};
