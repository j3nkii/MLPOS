import React from 'react';

const DETAULT_STYLE = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
const DEFAULT_PROPS = {
    type: 'text',
    label: '',
    name: '',
    placeholder: 'button',
    onChange: (x) => console.log(x),
    value: '',
}


export const Input = ({ label, type, name, placeholder, onChange, value } = DEFAULT_PROPS) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={DETAULT_STYLE}
                    value={value}
                    onChange={onChange}
                />
        </div>
    );
};