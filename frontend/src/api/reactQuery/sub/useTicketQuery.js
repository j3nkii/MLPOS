import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@services';
import { useModalZussy, useToastZussy } from '@zussy';
import { useNavigate } from 'react-router-dom';



export const useTicketQuery = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addError, addSuccess } = useToastZussy();
    const { closeModal } = useModalZussy();

    const createTicket = useMutation({
        mutationFn: ticketService.createTicket,
        onSuccess: async (result) => {
            navigate(`/tickets/${result.data.ticketID}`);
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            addSuccess('Ticket created.');
            closeModal();
        },
        onError: (error) => {
            addError('Ticket creation failed.');
            console.error(error);
        },
    });

    const readTicket = (ticketID) => {
        return useQuery({
            queryKey: ['selectedTicket', ticketID],
            queryFn: () => ticketService.readTicket({ ticketID }),
            enabled: !!ticketID,
        })
    }

    const readAllTickets = useQuery({
        queryKey: ['allTickets'],
        queryFn: ticketService.readAllTickets,
        onError: (error) => {
            console.error(error);
        },
    });

    const updateTicket = useMutation({
        mutationFn: ticketService.updateTicket,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKeys: ['allTickets', 'selectedTicket'] });
            addSuccess('Ticket updated.');
            closeModal();
        },
        onError: (error) => {
            addError('Ticket update failed.');
            console.error(error);
        },
    });

    const deleteTicket = useMutation({
        mutationFn: ticketService.deleteTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            addSuccess('Ticket deleted.');
            closeModal();
            navigate(`/tickets`)
        },
        onError: (error) => {
            addError('Ticket deletion failed.');
            console.error(error);
        },
    });


    // ITEMS
    const updateTicketItem = useMutation({
        mutationFn: ticketService.updateTicketItem,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKeys: ['selectedTicket', 'selectedCustomer'] });
            addSuccess('Ticket Item updated.');
            closeModal();
        },
        onError: (error) => {
            addError('Ticket Item update failed.');
            console.error(error);
        },
    });

    const createTicketItem = useMutation({
        mutationFn: ticketService.createTicketItem,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKeys: ['selectedTicket', 'selectedCustomer'] });
            addSuccess('Ticket Item created.');
        },
        onError: (error) => {
            addError('Ticket Item creation failed.');
            console.error(error);
        },
    });

    const deleteTicketItem = useMutation({
        mutationFn: ticketService.deleteTicketItem,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKeys: ['selectedTicket', 'selectedCustomer'] });
            addSuccess('Ticket Item deleted.');
            closeModal();
        },
        onError: (error) => {
            addError('Ticket Item deletion failed.');
            console.error(error);
        },
    });

    const createTicketSend = useMutation({
        mutationFn: ticketService.createTicketSend,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['selectedTicket'] });
            addSuccess('Ticket sent successfully.');
            closeModal();
        },
        onError: (error) => {
            addError('Ticket send failed.');
            console.error(error);
        },
    });

    return {
        createTicket,
        readTicket,
        readAllTickets,
        updateTicket,
        deleteTicket,
        createTicketItem,
        updateTicketItem,
        deleteTicketItem,
        createTicketSend,
    }
}
