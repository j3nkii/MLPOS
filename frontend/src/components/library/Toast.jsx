import { useEffect } from 'react';
import { X, CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';

/** @typedef {'success' | 'error' | 'info' | 'warning'} ToastVariant */

export const TOAST_VARIANT = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
};

const VARIANT_CONFIG = {
    success: {
        bar: 'bg-green-500',
        icon: CircleCheck,
        label: 'Success',
    },
    error: {
        bar: 'bg-red-500',
        icon: CircleX,
        label: 'Error',
    },
    info: {
        bar: 'bg-black',
        icon: Info,
        label: 'Info',
    },
    warning: {
        bar: 'bg-yellow-400',
        icon: TriangleAlert,
        label: 'Warning',
    },
};

const POSITION_CLASS = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
};

/**
 * Single toast tab. Controlled — pass onDismiss from your store.
 *
 * @param {object} props
 * @param {string} props.id
 * @param {string} [props.title]
 * @param {string} props.message
 * @param {ToastVariant} [props.variant]
 * @param {number|null} [props.duration] ms until auto-dismiss; null = no auto dismiss
 * @param {() => void} props.onDismiss
 */
export const ToastTab = ({
    id,
    title,
    message,
    variant = TOAST_VARIANT.INFO,
    duration = 3000,
    index,
    onDismiss,
}) => {
    const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info;
    const Icon = config.icon;

    useEffect(() => {
        if (duration == null || duration <= 0) return;
        const timer = setTimeout(() => onDismiss(index), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onDismiss]);

    return (
        <div
            role="status"
            aria-live="polite"
            data-toast-id={id}
            className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-4 border-black border-t-0 bg-white shadow-lg animate-[toast-in_200ms_ease-out]"
        >
            <div className={`h-1.5 ${config.bar}`} />
            <div className="flex gap-3 p-4">
                <Icon className="mt-0.5 shrink-0" size={22} aria-hidden />
                <div className="min-w-0 flex-1">
                    {title ? (
                        <p className="text-sm font-bold text-black">{title}</p>
                    ) : (
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {config.label}
                        </p>
                    )}
                    <p className={`text-sm text-gray-800 ${title ? 'mt-1' : ''}`}>{message}</p>
                </div>
                <button
                    type="button"
                    onClick={() => onDismiss(index)}
                    className="shrink-0 rounded-md p-1 text-black hover:bg-black hover:text-white transition-colors"
                    aria-label="Dismiss notification"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

/**
 * Fixed viewport for stacked toast tabs.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {keyof typeof POSITION_CLASS} [props.position]
 */
export const ToastStack = ({ children, position = 'top-right' }) => {
    if (!children) return null;

    return (
        <div
            className={`pointer-events-none fixed z-[100] flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col gap-2 overflow-y-auto px-2 ${POSITION_CLASS[position]}`}
            aria-label="Notifications"
        >
            {children}
        </div>
    );
};
