import React from 'react';

const DETAULT_STYLE = "py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
const DEFAUL_PROPS = {
    id: '',
    type: 'button',
    children: 'CLICK ME',
    name: 'button',
}

export const Button = ({ id, type, name, onClick, children } = DEFAUL_PROPS) => {
    console.log('AHHHH ::  ')
    console.log(name)
    console.log(children)
    return (
        <button
            id={id}
            name={name}
            type={type}
            onClick={onClick}
            className={DETAULT_STYLE}
        >
            {children}
        </button>
    );
};
