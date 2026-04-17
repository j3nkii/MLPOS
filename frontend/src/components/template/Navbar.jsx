import 'react';
import { Link } from 'react-router';
import { LogOut } from 'lucide-react';
import { useAuthQuery } from '@query';

import { Button } from '@components';


export const Navbar = () => {
    const { logout } = useAuthQuery();
    return (
        <div className='flex justify-center w-full px-25 py-5 bg-black text-white shadow'>
            <div className='max-w-[2400px] w-170 flex flex-row items-center justify-between'>
                <span className='text-lg font-bold'>MLPOS</span>
                <div className='flex'>
                    <Link className='hover:cursor-pointer' to='/'>
                        <Button color={'linkBlack'} className='bg-red-500 text-white px-3 py-1 rounded'>
                            Stripe
                        </Button>
                    </Link>
                    <Link className='hover:cursor-pointer' to='/customers'>
                        <Button color={'linkBlack'} className='bg-red-500 text-white px-3 py-1 rounded'>
                            Customers
                        </Button>
                    </Link>
                    <Link className='hover:cursor-pointer' to='/tickets'>
                        <Button color={'linkBlack'} className='bg-red-500 text-white px-3 py-1 rounded'>
                            Tickets
                        </Button>
                    </Link>
                    {/*::PLOPPIN_MODAL::*/}
                    <Button color={'red'} onClick={logout} className='bg-red-500 text-white px-3 py-1 rounded'>
                        <LogOut />
                    </Button>
                </div>
            </div>
        </div>
    );
};
