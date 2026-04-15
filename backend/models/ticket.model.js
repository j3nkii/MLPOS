
const getAllTickets = async ({ userID, client }) => {
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
        WHERE tickets.user_id = $1
            AND tickets.is_deleted = false
        GROUP BY tickets.id, customers.name
        ORDER BY created_at DESC;
    `, [ userID ]);
    return rows;
}


const getTicket = async ({ ticketID, client }) => {
    const { rows: [ row ]} = await client.query(`
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
        WHERE tickets.id = $1
            AND tickets.is_deleted = false
        GROUP BY tickets.id, customers.name
        ORDER BY created_at DESC;
    `, [ ticketID ]);
    return row;
}

const handleTicketStatus = async({ client, ticketID }) => {
    // const ticket = await getTicket({ client, ticketID });
    // let totalPaid = 0;
    // for(let row of ticket.payments){
    //     totalPaid += Number(row.price);
    // }
    // if(Number(ticket.price) >= Number(totalPaid)){
    //     await client.query(`UPDATE tickets SET invoice_status = 'paid' WHERE id = $1`, [ticketID]);
    // } else if(Number(ticket.price) > Number(totalPaid)){
    //     await client.query(`UPDATE tickets SET invoice_status = 'pending' WHERE id = $1`, [ticketID]);
    // } else if(Number(ticket.price) === 0){
    //     await client.query(`UPDATE tickets SET invoice_status = 'pending' WHERE id = $1`, [ticketID]);
    // }
}

module.exports = {
    getAllTickets,
    getTicket,
    handleTicketStatus,
}