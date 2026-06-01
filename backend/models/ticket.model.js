
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
    // B1.5 — invoice status from payments vs line total
};

module.exports = {
    getAllTickets,
    handleTicketStatus,
};
