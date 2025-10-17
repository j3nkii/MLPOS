import React from 'react';
import { Link } from "react-router";
import { useStateManager } from '@useStateManager'
import { Button } from '@components'
import { CircleUserRound, LogOut } from 'lucide-react'


export const Navbar = () => {

    const { logout } = useStateManager();

    return (
        <div className="w-full flex flex-row items-center justify-between px-25 py-5 bg-gray-200 shadow">
            <span className="text-lg font-bold">MLPOS</span>
            <div className='flex'>

                <Link to='/customers'>
                    <Button className="bg-red-500 text-white px-3 py-1 rounded">
                        Customers
                    </Button>
                </Link>
                <Link to='/invoicing'>
                    <Button className="bg-red-500 text-white px-3 py-1 rounded">
                        Invoicing
                    </Button>
                </Link>
                <Button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                    <LogOut />
                </Button>
            </div>
        
        </div>
    );
};