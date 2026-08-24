/**
 * Full-page overlay spinner — use while queries/mutations block the UI.
 * Pair with toasts: show PageLoader during work, pushToast on settle.
 *
 * @param {object} props
 * @param {boolean} props.show
 * @param {string} [props.label]
 */
export const PageLoader = ({ show = false, label = 'Loading' }) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/45 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p className="mt-4 text-lg font-semibold text-white">{label}</p>
        </div>
    );
};
