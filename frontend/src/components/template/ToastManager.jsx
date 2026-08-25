import { ToastStack, ToastTab } from '@components';
import { useToastZussy } from '@zussy';
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

export const ToastManager = () => {
    const { toasts, dismissToast } = useToastZussy();
    if (!toasts.length) return null;
    const onDismiss = (index) => {
        dismissToast({ index });
    }
    return (
        <ToastStack position={'bottom-right'}>
            {toasts.map((toast) => (
                <ToastTab
                    toast={toast}
                    onDismiss={onDismiss}
                />
            ))}
        </ToastStack>
    );
};
