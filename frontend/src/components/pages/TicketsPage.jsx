import 'react';
import { Table } from '@components';
import { useTicketQuery } from '@query';



export const TicketsPage = () => {
    const { readAllTickets } = useTicketQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold no-wrap'>Tickets:</h1>
            <Table config={'tickets'} data={readAllTickets?.data?.data} />
        </div>
    );
};