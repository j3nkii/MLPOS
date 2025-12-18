import 'react';
import { useCustomer, useModal } from '@useState';


import { customerService } from '@services';


export const useCustomerActions = () => {
    const { setSelectedCustomer, setAllCustomers, setLoading } = useCustomer();
    const { closModal } = useModal();

    const _refreshCustomers = async() => {
        const res = await customerService.readAllCustomers();
        setAllCustomers(res.data);
    }

    const createCustomer = async (body) => {
        console.log(body)
        try {
            setLoading(true);
            await customerService.createCustomer(body);
            _refreshCustomers();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const readCustomer = async (customerID) => {
        try {
            setLoading(true);
            const res = await customerService.readCustomer(customerID);
            setSelectedCustomer(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const readAllCustomers = async () => {
        try {
            setLoading(true);
            const res = await customerService.readAllCustomers();
            setAllCustomers(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const updateCustomer = async (customerID, body) => {
        try {
            setLoading(true);
            await customerService.updateCustomer(customerID, body);
            _refreshCustomers();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteCustomer = async (customerID) => {
        try {
            setLoading(true);
            await customerService.deleteCustomer(customerID);
            _refreshCustomers();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        createCustomer,
        readCustomer,
        readAllCustomers,
        updateCustomer,
        deleteCustomer,
    }
}
