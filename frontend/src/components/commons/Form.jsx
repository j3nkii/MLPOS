import {useEffect, useState} from 'react';
import { Input } from '@components'



const labelMap = {
    name: '',
    phone: '',
    email: '',
    amount: '',
    customerID: '',
    status: '',
}
const protoProps = [
    {
        label: 'Name',
        value: 'name',
        type: 'text'
    }
]


export const Form = ({ onChange, onSubmit, fields }) => {
    const [form, setForm] = useState({});

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setForm({ ...form, [name]: value });
    }

    useEffect(() => {
        console.log('#$$$$$$ UE')
        const test = protoProps.map(x => [x.value, '']);
        console.log(test)
        const anotherTest = Object.fromEntries(test)
        console.log(anotherTest)
    }, []);




    return (
        <div>
            <form onSubmit={onSubmit}>
                { protoProps.map((input) => {
                    console.log('### input', input)
                    return (
                    <Input
                        onChange={handleChange}
                        value={form[input.value]}
                        label={input.label}
                        name={input.value}
                        type={input.type}
                    />
                )})}
            </form>
        </div>
    )
}