import React from 'react';



const COLOR = {
    black: 'bg-black text-white',
    red: 'bg-red text-white',
    orange: 'gb-orange text-white',
}



const DETAULT_STYLE = "py-2 px-3 font-semibold transition-colors rounded-4xl cursor-pointer"
const DEFAUL_PROPS = {
    id: '',
    type: 'button',
    children: 'CLICK ME',
    name: 'button',
    color: 'black'
}



export const Button = ({ id, type, name, onClick, children, color } = DEFAUL_PROPS) => {
    return (
        <button
            id={id}
            name={name}
            type={type}
            onClick={onClick}
            className={`${DETAULT_STYLE} ${COLOR[color]}`}
        >
            {children}
        </button>
    );
};
