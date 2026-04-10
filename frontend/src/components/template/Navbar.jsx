import 'react';
import { Link } from "react-router";
import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { Button } from '@components';


export const Navbar = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const logout = () => {
        queryClient.removeQueries({ queryKey: ['user'] });
        sessionStorage.clear();
        navigate('/login');
    }
    return (
        <div className="flex justify-center w-full px-25 py-5 bg-[#5d5d5d] text-white shadow">
            <div className='max-w-[2400px] w-170 flex flex-row items-center justify-between'>
                <span className="text-lg font-bold">MLPOS</span>
                <div className='flex'>
                    <Link className='hover:cursor-pointer' to='/customers'>
                        <Button className="bg-red-500 text-white px-3 py-1 rounded">
                            Customers
                        </Button>
                    </Link>
                    <Link className='hover:cursor-pointer' to='/invoices'>
                        <Button className="bg-red-500 text-white px-3 py-1 rounded">
                            Invoices
                        </Button>
                    </Link>
                    <Button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                        <LogOut />
                    </Button>
                </div>
            </div>
        </div>
    );
};
