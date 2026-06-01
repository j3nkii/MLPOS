const INVOICE_STATUS = {
    QUOTE: 'quote',
    SENT: 'sent',
    PARTIALLY_PAID: 'partially_paid',
    OVERDUE: 'overdue',
    PAID: 'paid',
    CANCELLED: 'cancelled',
};

const SENT_LIKE = new Set([INVOICE_STATUS.SENT, INVOICE_STATUS.OVERDUE]);

function normalizeCents(value) {
    const num = Number(value || 0);
    if (!Number.isFinite(num)) return 0;
    return Math.max(0, Math.floor(num));
}

function resolveInvoiceStatus({ currentStatus, ticketTotalCents, paidTotalCents }) {
    if (currentStatus === INVOICE_STATUS.CANCELLED) {
        return INVOICE_STATUS.CANCELLED;
    }

    const ticketTotal = normalizeCents(ticketTotalCents);
    const paidTotal = normalizeCents(paidTotalCents);

    if (paidTotal >= ticketTotal && ticketTotal > 0) {
        return INVOICE_STATUS.PAID;
    }

    if (paidTotal > 0 && paidTotal < ticketTotal) {
        return INVOICE_STATUS.PARTIALLY_PAID;
    }

    if (paidTotal === 0 && SENT_LIKE.has(currentStatus)) {
        return currentStatus;
    }

    return INVOICE_STATUS.QUOTE;
}

module.exports = {
    INVOICE_STATUS,
    resolveInvoiceStatus,
};
