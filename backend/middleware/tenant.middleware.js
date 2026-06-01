const pool = require('../modules/pool');

/**
 * Binds a Postgres session to the authenticated account (tenant).
 * Sets app.account_id for Row Level Security policies.
 * Attaches req.db — use this instead of pool in authenticated routes.
 */
const tenantMiddleware = async (req, res, next) => {
    const attrs = req.user?.attributes;
    const accountId = attrs?.mlpos_account_id ?? attrs?.mplos_account_id;

    if (!accountId) {
        return res.status(401).json({ error: 'Tenant context required' });
    }

    const client = await pool.connect();
    let released = false;
    const release = () => {
        if (!released) {
            released = true;
            client.release();
        }
    };

    try {
        await client.query(`SELECT set_config('app.account_id', $1, true)`, [accountId]);
        req.db = client;
        req.accountId = accountId;
        req.userId = attrs.mlpos_id;
        res.on('finish', release);
        res.on('close', release);
        next();
    } catch (err) {
        release();
        console.error(err);
        res.status(500).json({ error: 'Tenant session failed' });
    }
};

module.exports = tenantMiddleware;
