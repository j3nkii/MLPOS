import React from 'react';



const COLOR = {
    black: 'hover:bg-black hover:text-white',
    red: 'bg-red text-white',
    orange: 'gb-orange text-white',
}



const DETAULT_STYLE = "p-2 mx-1 font-semibold transition-colors rounded-md cursor-pointer"
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
            className={`${DETAULT_STYLE} ${COLOR['black']}`}
        >
            {children}
        </button>
    );
};
