import {useEffect, useState} from 'react';
import { Input } from '@components'



const protoProps = [
    {
        label: 'Name',
        value: 'name',
        prefill: 'Gata'
    },
    {
        label: 'Phone',
        value: 'phone',
        prefill: '6125559090'
    },
    {
        label: 'Customer ID',
        value: 'customerID',
        prefill: '123',
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


export const Form = ({ onSubmit, fields = [], isUpdate = false, form = {}, setForm = () => console.warn('NO FORM FUNCTION') }) => {

    useEffect(() => {
        const toArr = fields.map(x => [
            x.value,
            isUpdate ? x.prefill : ''
        ]);
        const toObj = Object.fromEntries(toArr);
        setForm(toObj);
    }, []);

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = () => {
        onSubmit(form);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                { fields.map((input, idx) => {
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