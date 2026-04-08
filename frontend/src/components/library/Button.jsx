import 'react';



const COLOR = {
    black: 'hover:bg-black hover:text-white',
    red: 'hover:bg-red-500 hover:text-white',
    green: 'hover:bg-green-500 hover:text-white',
    orange: 'gb-orange text-white',
}



const DETAULT_STYLE = "p-2 mx-1 font-semibold transition-colors rounded-md cursor-pointer bg-[#cdcdcd]";



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
