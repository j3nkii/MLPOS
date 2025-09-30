import axios from 'axios'



export const getCustomer = async ( userID ) => {
    try {
        // const { userID } = body;
        const res = await axios.get(`/api/customer?userID=${userID}`);
        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
}



export const getAllCustomers = async ( body ) => {
    try {
        const res = await axios.get(`/api/customers`);
        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
}