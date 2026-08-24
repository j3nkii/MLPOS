import { ToastStack, ToastTab } from '@components';

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

export const ToastManager = ({
    toasts = [],
    onDismiss = () => {},
    position = 'top-right',
}) => {
    if (!toasts.length) return null;

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
                    onDismiss={onDismiss}
                />
            ))}
        </ToastStack>
    );
};
