
const getAllInvoices = async ({ userID, client }) => {
    const { rows } = await client.query(`
        SELECT
            invoices.*,
            customers.name,
            SUM(invoice_items.price * invoice_items.quantity) as price,
            COALESCE(JSON_AGG(invoice_items) FILTER (WHERE invoice_items.invoice_id IS NOT NULL), '[]') as details,
            COALESCE((
                WITH payments_clone AS (
                    SELECT * FROM payments WHERE invoice_id = invoices.id AND is_deleted = false
                )
                SELECT JSON_AGG(payments_clone.*) AS reults FROM payments_clone
            ), '[]') AS payments
        FROM invoices
        LEFT JOIN invoice_items
            ON invoice_items.invoice_id = invoices.id
            AND invoice_items.is_deleted = false
        JOIN customers
            ON customers.id = invoices.customer_id
            AND customers.is_deleted = false
        WHERE invoices.user_id = $1
            AND invoices.is_deleted = false
        GROUP BY invoices.id, customers.name
        ORDER BY created_at DESC;
    `, [ userID ]);
    return rows;
}


const getInvoice = async ({ invoiceID, client }) => {
    const { rows: [ row ]} = await client.query(`
        SELECT
            invoices.*,
            customers.name,
            SUM(invoice_items.price * invoice_items.quantity) as price,
            COALESCE(JSON_AGG(invoice_items) FILTER (WHERE invoice_items.invoice_id IS NOT NULL), '[]') as details,
            COALESCE((
                WITH payments_clone AS (
                    SELECT * FROM payments WHERE invoice_id = invoices.id AND is_deleted = false
                )
                SELECT JSON_AGG(payments_clone.*) AS reults FROM payments_clone
            ), '[]') AS payments
        FROM invoices
        LEFT JOIN invoice_items
            ON invoice_items.invoice_id = invoices.id
            AND invoice_items.is_deleted = false
        JOIN customers
            ON customers.id = invoices.customer_id
            AND customers.is_deleted = false
        WHERE invoices.id = $1
            AND invoices.is_deleted = false
        GROUP BY invoices.id, customers.name
        ORDER BY created_at DESC;
    `, [ invoiceID ]);
    return row;
}

const handleInvoiceStatus = async({ client, invoiceID }) => {
    const invoice = await getInvoice({ client, invoiceID });
    let totalPaid = 0;
    for(let row of invoice.payments){
        totalPaid += Number(row.price);
    }
    if(Number(invoice.price) <= Number(totalPaid)){
        await client.query(`UPDATE invoices SET status = 'paid' WHERE id = $1`, [invoiceID]);
    } else if(Number(invoice.price) > Number(totalPaid)){
        await client.query(`UPDATE invoices SET status = 'pending' WHERE id = $1`, [invoiceID]);
    } else if(invoice.status === 'quote'){
        await client.query(`UPDATE invoices SET status = 'pending' WHERE id = $1`, [invoiceID]);
    }
}

module.exports = {
    getAllInvoices,
    getInvoice,
    handleInvoiceStatus,
}