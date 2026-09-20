import 'react';

const DETAULT_STYLE = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
const DISABLED_STYLE = 'w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
const onChangeWarning = () => console.warn('No Warning set for on change.');

const SELECT_OPTIONS = {
    orderStatus: [
        { id: 'waiting', name: 'Waiting' },
        { id: 'in_progress', name: 'In Progress' },
        { id: 'fufilled', name: 'Fufilled' },
        { id: 'rework', name: 'Rework' },
        { id: 'cancelled', name: 'Cancelled' },
    ],
    productType: [
        { id: 'service', name: 'Service' },
        { id: 'inventory', name: 'Inventory' },
    ],
    paymentType: [
        { id: 'cash', name: 'Cash' },
        { id: 'check', name: 'Check' },
        { id: 'venmo', name: 'Venmo' },
        { id: 'cash app', name: 'Cash App' },
        { id: 'squaer', name: 'Square' },
        { id: 'paypal', name: 'PayPal' },
        { id: 'zelle', name: 'Zelle' },
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'stripe', name: 'Stripe' },
    ],
    appointmentStatus: [
        { id: 'scheduled', name: 'Scheduled' },
        { id: 'in_progress', name: 'In Progress' },
        { id: 'rescheduled', name: 'Rescheduled' },
        { id: 'complete', name: 'Complete' },
    ]
}


export const Input = (props) => {
    const { label = '', type = 'text', name = '' } = props;
    const Component = type === 'select' ? Select : Standard;
    return (
        <div>
            <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            { <Component {...props} /> }
        </div>
    );
};


const Standard = (props) => {
    const {  type = 'text', name = '', placeholder = '', onChange = onChangeWarning, value = '', disabled = false, ref = null } = props;
    return (
        <input
            ref={ref}
            disabled={disabled}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={disabled ? DISABLED_STYLE : DETAULT_STYLE}
            value={value}
            onChange={onChange}
            checked={value}
        />
    )
}


const Select = (props) => {
    const { name = '', onChange = onChangeWarning, value = '', options = [], disabled = false, optionsType = null } = props;
    const data = optionsType ? SELECT_OPTIONS[optionsType] : options;
    return (
        <select placeholder='Please choose' disabled={disabled} onChange={onChange} name={name} value={value}>
            <option>---</option>
            { data.map(opt => <option  value={opt.id} data-meta={JSON.stringify(opt)}>{opt.name}</option>) }
        </select>
    )
}
