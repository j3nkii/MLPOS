import React from 'react';
import { Link } from "react-router";
import { useStateManager } from '@useStateManager'
import { Button } from '@components'
import { CircleUserRound, LogOut } from 'lucide-react'

// export const Navbar = () => {
//     const { user, logOut } = useStateManager()

//     return (
//         <div className="flex justify-between items-center p-4 bg-gray-200">
//             <span className="font-bold">myApp</span>
//             {user && (
//                 <Button onClick={logOut}>
//                     Logout
//                 </Button>
//             )}
//         </div>
//     )
// }



export const Navbar = () => {

    const { user, logout } = useStateManager();

    return (
        <div className="w-full flex flex-row items-center justify-between px-25 py-5 mb-8 bg-gray-200 shadow">
        <span className="text-lg font-bold">MLPOS</span>
        <div>

            {/* <Button className="bg-red-500 text-white px-3 py-1 rounded">
                <CircleUserRound />
            </Button> */}
            <Link to='/invoicing'>
                invoicing
            </Link>
            <Button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                <LogOut />
            </Button>
        </div>
        
        </div>
    );
};