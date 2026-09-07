import { useEffect, useState } from 'react';
import { Button } from '@components';
import { useModalZussy } from '@zussy';
import { useBookingQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, Pencil } from 'lucide-react'



const INITIAL = {
    price: '',
    bookingID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedBookingPage = () => {
    const params = useParams();
    const { readAllBookings } = useBookingQuery();
    const [selectedBooking, setSelectedBooking] = useState(INITIAL);
    const { setModal } = useModalZussy();

    useEffect(() => {
        const { bookingID } = params;
        const bookingIndex = readAllBookings?.data?.data.findIndex(x => x.id === bookingID);
        const selectedBooking = readAllBookings?.data?.data[bookingIndex];
        if(selectedBooking){
            setSelectedBooking(selectedBooking);
        }
    }, [readAllBookings?.data?.data]);

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deleteBooking',
            item: selectedBooking,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updateBooking',
            item: selectedBooking,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <h1 className=' text-4xl font-extrabold'>{selectedBooking.id}</h1>
            <div className='flex'>
                <div className='flex items-center'>
                    <Button
                        color='yellow'
                        onClick={onUpdate} 
                        text='Update'
                    ><Pencil />
                    </Button>
                    <Button
                        color={'red'}
                        onClick={onDelete} 
                        text='Delete'
                    ><Trash2 />
                    </Button>
                </div>
            </div>
        </div>
    );
}
