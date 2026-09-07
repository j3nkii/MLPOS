import axios from 'axios';

export const bookingService = {
    readAllBookings: () => axios.get(`/api/booking`),
    readBooking: ({ id }) => axios.get(`/api/booking/${id}`),
    createBooking: ({ body }) => axios.post(`/api/booking`, body),
    updateBooking: ({ id, body }) => axios.put(`/api/booking/${id}`, body),
    deleteBooking: ({ id }) => axios.delete(`/api/booking/${id}`),
};
