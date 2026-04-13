import 'react';



const COLOR = {
    white: 'hover:bg-black hover:text-white text-black bg-white',
    black: 'hover:bg-white hover:text-black text-white bg-black',
    red: 'hover:bg-red-500 hover:text-white text-white bg-black',
    green: 'hover:bg-green-500 hover:text-white text-white text-black',
    orange: 'gb-orange text-white',
}



// const DETAULT_STYLE = 'p-2 mx-1 font-semibold transition-colors rounded-md cursor-pointer bg-[#cdcdcd]';
const DETAULT_STYLE = 'p-2 mx-1 font-semibold transition-colors rounded-md cursor-pointer';



export const Button = ({ id = '', type = 'button', name = 'button', onClick = () => (null), children = null, color = 'black' }) => {
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
