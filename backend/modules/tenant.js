/**
 * Tenant = accounts row. All business data is scoped by account_id.
 * RLS policies read app.account_id (set in tenant.middleware).
 */

async function setTenantOnClient(client, accountId) {
    await client.query(`SELECT set_config('app.account_id', $1, true)`, [accountId]);
}

module.exports = {
    setTenantOnClient,
};
