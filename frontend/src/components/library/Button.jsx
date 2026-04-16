import 'react';



const COLOR = {
    white: 'hover:bg-black hover:text-white text-black bg-white',
    black: 'hover:bg-white hover:text-black text-white bg-black',
    yellow: 'hover:bg-yellow-400 hover:text-black text-white bg-black',
    red: 'hover:bg-red-500 hover:text-white text-white bg-black',
    green: 'hover:bg-green-500 hover:text-white bg-black text-white',
    orange: 'gb-orange text-white',
    linkBlue: 'hover:text-purple-900 hover:bg-blue-300 text-white bg-black',
    linkBlack: 'hover:bg-purple-300 hover:text-blue-600 text-white bg-black',
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
