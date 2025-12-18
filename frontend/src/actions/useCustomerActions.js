import 'react';
import { useCustomer } from '@useStateManager';


import customerService from '../service/customer';


export const useToggle = () => {
    const { setSelectedCustomer, setAllCustomers, setloading } = useCustomer();

    const _refreshCustomers = async() => {
        const res = await customerService.readAllCustomers();
        setAllCustomers(res.data);
    }

    const createCustomer = async (body) => {
        try {
            setloading(true);
            await customerService.createCustomer(body);
            _refreshCustomers()
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setloading(false);
        }
    }

    const readCustomer = async (customerID) => {
        try {
            setloading(true);
            const res = await customerService.readCustomer(customerID);
            setSelectedCustomer(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setloading(false);
        }
    }

    const readAllCustomers = async () => {
        try {
            setloading(true);
            const res = await customerService.readAllCustomers();
            setAllCustomers(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setloading(false);
        }
    }

    const updateCustomer = async (customerID, body) => {
        try {
            setloading(true);
            await customerService.updateCustomer(customerID, body);
            _refreshCustomers();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setloading(false);
        }
    }

    const deleteCustomer = async (customerID) => {
        try {
            setloading(true);
            await customerService.deleteCustomer(customerID);
            _refreshCustomers();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setloading(false);
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
