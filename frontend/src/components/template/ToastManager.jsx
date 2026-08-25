import { ToastStack, ToastTab } from '@components';
import { useState } from 'react';

/**
 * ToastManager — mount once in Layout (next to ModalManager).
 *
 * Wire your zustand store to these props, e.g.:
 *
 *   const { toasts, dismissToast } = useToastZussy();
 *   <ToastManager toasts={toasts} onDismiss={dismissToast} />
 *
 * Expected toast shape:
 *   { id: string, message: string, title?: string, variant?: 'success'|'error'|'info'|'warning', duration?: number|null }
 *
 * Suggested store actions:
 *   pushToast({ message, title?, variant?, duration? })  // generate id inside store
 *   dismissToast(id)
 *   clearToasts()
 */

const TOASTS_TEST = [
    {
        title: 'ERROR',
        message: 'This is an Error.',
        variant: 'error',
    },
    {
        title: 'SUCCESS',
        message: 'This is a Success.',
        variant: 'success'
    },
    {
        title: 'INFO',
        message: 'This is an Info.',
        variant: 'info'
    },
    {
        title: 'WARNING',
        message: 'This is a Warning.',
        variant: 'warning'
    },
]

const reIndex = (x, i) => ({ ...x, index: i});

export const ToastManager = ({
    // toasts = TOASTS_TEST,
    // onDismiss = () => {},
    position = 'top-right',
}) => {
    const [toasts, setToasts] = useState(TOASTS_TEST.map(reIndex));
    if (!toasts.length) return null;
    const onDismiss = (index) => {
        const copy = [ ...toasts ]
        copy.splice(index, 1);
        setToasts(copy.map(reIndex));
    }
    return (
        <ToastStack position={position}>
            {toasts.map((toast) => (
                <ToastTab
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    message={toast.message}
                    variant={toast.variant}
                    duration={toast.duration}
                    index={toast.index}
                    onDismiss={onDismiss}
                />
            ))}
        </ToastStack>
    );
};
