import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@services';
import { useModalZussy } from '@zussy';



export const useBookingQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const _refresh = async () => {
        await queryClient.fetchQuery({
            queryKey: ['booking'],
            queryFn: bookingService.readAllBookings,
            onError: (error) => console.error(error),
        });
    };

    const readAllBookings = useQuery({
        queryKey: ['booking'],
        queryFn: bookingService.readAllBookings,
        onError: (error) => console.error(error),
    });

    // const readBooking = useQuery({
    //     queryKey: ['booking'],
    //     queryFn: bookingService.readBooking,
    //     onError: (error) => console.error(error),
    // });

    const createBooking = useMutation({
        mutationFn: bookingService.createBooking,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['booking'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const updateBooking = useMutation({
        mutationFn: bookingService.updateBooking,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['booking'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteBooking = useMutation({
        mutationFn: bookingService.deleteBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    return {
        readAllBookings,
        // readBooking,
        createBooking,
        updateBooking,
        deleteBooking
    };
};
