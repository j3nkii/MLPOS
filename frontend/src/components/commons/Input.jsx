import React from 'react';

const DETAULT_STYLE = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
const onChangeWarning = () => console.warn('No Warning set for on change.')


export const Input = (props) => {
    const { label = '', type = 'text', name = '' } = props;
    const Component = type === 'select' ? Select : Standard;
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            { <Component {...props} /> }
        </div>
    );
};


const Standard = (props) => {
    const {  type = 'text', name = '', placeholder = '', onChange = onChangeWarning, value = ''} = props;
    return (
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={DETAULT_STYLE}
            value={value}
            onChange={onChange}
        />
    )
}


const Select = (props) => {
    const { name = '', onChange = onChangeWarning, value = '', options = [] } = props;
    console.log(options)
    return (
        <select onChange={onChange} name={name}>
            <option value={value}>---</option>
            { options.map(opt => <option value={opt.value}>{opt.name}</option>) }
        </select>
    )
}