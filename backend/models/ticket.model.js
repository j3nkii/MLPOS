const { resolveInvoiceStatus } = require('../modules/invoiceStatus');

const getAllTickets = async ({ accountId, client }) => {
    const { rows } = await client.query(`
        SELECT
            tickets.*,
            customers.name,
            SUM(ticket_items.price * ticket_items.quantity) as price,
            COALESCE(JSON_AGG(ticket_items) FILTER (WHERE ticket_items.ticket_id IS NOT NULL), '[]') as details,
            COALESCE((
                WITH payments_clone AS (
                    SELECT * FROM payments WHERE ticket_id = tickets.id AND is_deleted = false
                )
                SELECT JSON_AGG(payments_clone.*) AS reults FROM payments_clone
            ), '[]') AS payments
        FROM tickets
        LEFT JOIN ticket_items
            ON ticket_items.ticket_id = tickets.id
            AND ticket_items.is_deleted = false
        JOIN customers
            ON customers.id = tickets.customer_id
            AND customers.is_deleted = false
        WHERE tickets.account_id = $1
            AND tickets.is_deleted = false
        GROUP BY tickets.id, customers.name
        ORDER BY tickets.created_at DESC;
    `, [accountId]);
    return rows;
};

const handleTicketStatus = async ({ client, ticketID }) => {
    const { rows: [ticket] } = await client.query(`
        SELECT
            t.id,
            t.invoice_status,
            COALESCE(SUM(ti.price * ti.quantity), 0) AS ticket_total_cents,
            COALESCE((
                SELECT SUM(p.price)
                FROM payments p
                WHERE p.ticket_id = t.id
                  AND p.is_deleted = false
            ), 0) AS paid_total_cents
        FROM tickets t
        LEFT JOIN ticket_items ti
            ON ti.ticket_id = t.id
            AND ti.is_deleted = false
        WHERE t.id = $1
          AND t.is_deleted = false
        GROUP BY t.id, t.invoice_status
    `, [ticketID]);

    if (!ticket) return;

    const nextStatus = resolveInvoiceStatus({
        currentStatus: ticket.invoice_status,
        ticketTotalCents: ticket.ticket_total_cents,
        paidTotalCents: ticket.paid_total_cents,
    });

    if (nextStatus === ticket.invoice_status) return;

    await client.query(`
        UPDATE tickets
        SET invoice_status = $2
        WHERE id = $1
    `, [ticketID, nextStatus]);
};

module.exports = {
    getAllTickets,
    handleTicketStatus,
};
