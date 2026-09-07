import axios from 'axios'

export const ticketService = {
    readAllTickets: () => axios.get(`/api/ticket`).then(res => res.data),
    createTicket: ({ body }) => axios.post('/api/ticket', body).then(res => res.data),
    readTicket: ({ ticketID }) => axios.get(`/api/ticket/${ticketID}`).then(res => res.data).then(res => res.data),
    updateTicket: ({ ticketID, body }) => axios.put(`/api/ticket/${ticketID}`, body).then(res => res.data),
    deleteTicket: ({ ticketID }) =>  axios.delete(`/api/ticket/${ticketID}`).then(res => res.data),
    createTicketSend: ({ ticketID }) =>  axios.post(`/api/ticket/send/${ticketID}`).then(res => res.data),
    createTicketItem: ({ ticketID, body }) => axios.post(`/api/ticket/ticket-item/${ticketID}`, body).then(res => res.data),
    updateTicketItem: ({ ticketItemID, body }) => axios.put(`/api/ticket/ticket-item/${ticketItemID}`, body).then(res => res.data),
    deleteTicketItem: ({ ticketItemID }) =>  axios.delete(`/api/ticket/ticket-item/${ticketItemID}`).then(res => res.data),
}
