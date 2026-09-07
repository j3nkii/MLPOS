import 'react';
import { Table } from '@components';
import { useBookingQuery } from '@query';



export const BookingsPage = () => {
    const { readAllBookings } = useBookingQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Bookings:</h1>
            <Table config={'bookings'} data={readAllBookings?.data?.data} />
        </div>
    );
};
