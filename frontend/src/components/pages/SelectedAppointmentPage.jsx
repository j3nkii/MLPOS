import { useEffect, useState } from 'react';
import { Button } from '@components';
import { useModalZussy } from '@zussy';
import { useAppointmentQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, Pencil } from 'lucide-react'



const INITIAL = {
    price: '',
    appointmentID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedAppointmentPage = () => {
    const params = useParams();
    const { readAllAppointments } = useAppointmentQuery();
    const [selectedAppointment, setSelectedAppointment] = useState(INITIAL);
    const { setModal } = useModalZussy();

    useEffect(() => {
        const { appointmentID } = params;
        const appointmentIndex = readAllAppointments?.data.findIndex(x => x.id === appointmentID);
        const selectedAppointment = readAllAppointments?.data[appointmentIndex];
        if(selectedAppointment){
            setSelectedAppointment(selectedAppointment);
        }
    }, [readAllAppointments?.data]);

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deleteAppointment',
            item: selectedAppointment,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updateAppointment',
            item: selectedAppointment,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <h1 className=' text-4xl font-extrabold'>{selectedAppointment.id}</h1>
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
