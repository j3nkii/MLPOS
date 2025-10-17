import React, { useEffect, useState } from "react";

const LOADING_TEXT = [ 'Loading.', 'Loading..', 'Loading...', 'Loading....', 'Loading.....' ];




export const Loading = () => {
    const [text, setText] = useState(0);
    useEffect(() => {
        setTimeout(() => setText(prev => ((prev + 1) % LOADING_TEXT.length)), 400)
    }, [ text ]);
    return (
        <div className='loading-loader'>
            <p>{LOADING_TEXT[text]}</p>
        </div>
    );
}



// export const Success = () => {
//     return (
//         <div className='success-loader'>
//             <p>Success!</p>
//         </div>
//     );
// }



export const Error = () => {
    return (
        <div className='error-loader'>
            <p>Error!</p>
        </div>
    );
}