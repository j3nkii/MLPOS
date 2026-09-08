import axios from 'axios';

export const appointmentService = {
    readAllAppointments: () => axios.get(`/api/appointment`).then(res => res.data),
    readAppointment: ({ id }) => axios.get(`/api/appointment/${id}`).then(res => res.data),
    createAppointment: ({ body }) => axios.post(`/api/appointment`, body).then(res => res.data),
    updateAppointment: ({ id, body }) => axios.put(`/api/appointment/${id}`, body).then(res => res.data),
    deleteAppointment: ({ id }) => axios.delete(`/api/appointment/${id}`).then(res => res.data),
};
