import 'react';
import { Table } from '@components';
import { useAppointmentQuery } from '@query';



export const AppointmentsPage = () => {
    const { readAllAppointments } = useAppointmentQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Appointments:</h1>
            <Table config={'appointments'} data={readAllAppointments?.data} isManage={false} />
        </div>
    );
};
