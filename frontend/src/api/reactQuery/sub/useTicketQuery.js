import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@services';
import { useModalZussy} from '@zussy';
import { useNavigate } from 'react-router-dom';



export const useTicketQuery = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const _refreshTickets = async() => {
        await queryClient.fetchQuery({
            queryKey: ['allTickets'],
            queryFn: ticketService.readAllTickets,
            onError: (error) => console.error(error)
        });
    }

    const createTicket = useMutation({
        mutationFn: ticketService.createTicket,
        onSuccess: async (result) => {
            navigate(`/tickets/${result.data.data.ticketID}`)
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    // const readTicket = useQuery({
    //     queryKey: ['invocie', ticketID],
    //     queryFn: () => ticketService.readTicket(ticketID),
    //     onSuccess: (res) => setSelectedTicket(res.data),
    //     onError: (error) => console.error(error),
    //     enabled: !!ticketID,
    // })

    const readAllTickets = useQuery({
        queryKey: ['allTickets'],
        queryFn: ticketService.readAllTickets,
        onError: (error) => console.error(error),
    });

    const updateTicket = useMutation({
        mutationFn: ticketService.updateTicket,
        onSuccess: async () => {
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteTicket = useMutation({
        mutationFn: ticketService.deleteTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
            navigate(`/tickets`)
        },
        onError: (error) => console.error(error),
    });


    // ITEMS
    const updateTicketItem = useMutation({
        mutationFn: ticketService.updateTicketItem,
        onSuccess: async () => {
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const createTicketItem = useMutation({
        mutationFn: ticketService.createTicketItem,
        onSuccess: async () => {
            // not super sure why this had to be done this way in order to work. invalidate was not refreshing data. 
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
        },
        onError: (error) => console.error(error),
    });

    const deleteTicketItem = useMutation({
        mutationFn: ticketService.deleteTicketItem,
        onSuccess: async () => {
            // not super sure why this had to be done this way in order to work. invalidate was not refreshing data. 
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const createTicketSend = useMutation({
        mutationFn: ticketService.createTicketSend,
        onSuccess: async () => {
            // not super sure why this had to be done this way in order to work. invalidate was not refreshing data. 
            await _refreshTickets()
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    return {
        createTicket,
        // readTicket,
        readAllTickets,
        updateTicket,
        deleteTicket,
        createTicketItem,
        updateTicketItem,
        deleteTicketItem,
        createTicketSend,
    }
}
