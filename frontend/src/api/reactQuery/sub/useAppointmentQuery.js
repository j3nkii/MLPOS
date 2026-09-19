import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@services';
import { useModalZussy } from '@zussy';



export const useAppointmentQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const _refresh = async () => {
        await queryClient.fetchQuery({
            queryKey: ['appointment'],
            queryFn: appointmentService.readAllAppointments,
            onError: (error) => console.error(error),
        });
    };

    const readAllAppointments = useQuery({
        queryKey: ['appointment'],
        queryFn: appointmentService.readAllAppointments,
        onError: (error) => console.error(error),
    });

    // const readAppointment = useQuery({
    //     queryKey: ['appointment'],
    //     queryFn: appointmentService.readAppointment,
    //     onError: (error) => console.error(error),
    // });

    const createAppointment = useMutation({
        mutationFn: appointmentService.createAppointment,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKeys: ['appointment', 'selectedTicket'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const updateAppointment = useMutation({
        mutationFn: appointmentService.updateAppointment,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['appointment'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteAppointment = useMutation({
        mutationFn: appointmentService.deleteAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointment'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    return {
        readAllAppointments,
        // readAppointment,
        createAppointment,
        updateAppointment,
        deleteAppointment
    };
};
