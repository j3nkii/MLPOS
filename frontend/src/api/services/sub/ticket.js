import axios from 'axios'

export const ticketService = {
    readAllTickets: () => axios.get(`/api/ticket`),
    createTicket: ({ body }) => axios.post('/api/ticket', body),
    readTicket: ({ ticketID }) => axios.get(`/api/ticket/${ticketID}`),
    updateTicket: ({ ticketID, body }) => axios.put(`/api/ticket/${ticketID}`, body),
    deleteTicket: ({ ticketID }) =>  axios.delete(`/api/ticket/${ticketID}`),
    createTicketSend: ({ ticketID }) =>  axios.post(`/api/ticket/send/${ticketID}`),
    createTicketItem: ({ ticketID, body }) => axios.post(`/api/ticket/ticket-item/${ticketID}`, body),
    updateTicketItem: ({ ticketItemID, body }) => axios.put(`/api/ticket/ticket-item/${ticketItemID}`, body),
    deleteTicketItem: ({ ticketItemID }) =>  axios.delete(`/api/ticket/ticket-item/${ticketItemID}`),
}
