import {useEffect, useState} from 'react';
import { Input } from '@components'



const protoProps = [
    {
        label: 'Name',
        value: 'name',
    },
    {
        label: 'Phone',
        value: 'phone',
    },
    {
        label: 'Customer ID',
        value: 'customerID',
        type: 'select',
        options: [
            {
                name: 'Jason',
                value: '123'
            },
            {
                name: 'Alison',
                value: '113'
            },
        ]
    },
]


export const Form = ({ onSubmit, fields = protoProps }) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        const toArr = fields.map(x => [x.value, '']);
        const toObj = Object.fromEntries(toArr);
        setForm(toObj)
    }, []);

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setForm({ ...form, [name]: value });
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                { protoProps.map((input, idx) => {
                    return (
                        <Input
                            key={idx}
                            onChange={handleChange}
                            value={form[input.value]}
                            label={input.label}
                            name={input.value}
                            type={input.type || 'text'}
                            options={input.options || []}
                        />
                    )
                })}
            </form>
        </div>
    )
}