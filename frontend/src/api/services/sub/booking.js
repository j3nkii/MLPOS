import axios from 'axios';

export const bookingService = {
    readAllBookings: () => axios.get(`/api/booking`).then(res => res.data),
    readBooking: ({ id }) => axios.get(`/api/booking/${id}`).then(res => res.data),
    createBooking: ({ body }) => axios.post(`/api/booking`, body).then(res => res.data),
    updateBooking: ({ id, body }) => axios.put(`/api/booking/${id}`, body).then(res => res.data),
    deleteBooking: ({ id }) => axios.delete(`/api/booking/${id}`).then(res => res.data),
};
