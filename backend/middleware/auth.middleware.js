const cognitoService = require('../modules/cognito');
const pool = require('../modules/pool');

const USER_WITH_TENANT_SQL = `
    SELECT
        users.*,
        users.id AS mlpos_id,
        users.account_id AS mlpos_account_id,
        accounts_stripe.stripe_account_id
    FROM users
    LEFT JOIN accounts_stripe ON accounts_stripe.account_id = users.account_id
    WHERE users.email = $1 AND users.is_deleted = false
`;

const authMiddleware = async (req, res, next) => {
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === 'production') {
        return handleCognito(req, res, next);
    }
    if (NODE_ENV === 'develop') {
        return handleLocalAuth(req, res, next);
    }
    return res.status(401).json({ error: 'Unauthorized' });
};

const handleLocalAuth = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        if (!token) throw new Error('Missing token');
        const dbRes = await pool.query(USER_WITH_TENANT_SQL, [token]);
        if (!dbRes.rows[0]) throw new Error('User not found');
        req.user = { attributes: dbRes.rows[0] };
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const handleCognito = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        if (!token) throw new Error('Missing token');
        const cognitoUser = await cognitoService.getUser(token);
        const dbRes = await pool.query(USER_WITH_TENANT_SQL, [cognitoUser.attributes.email]);
        if (!dbRes.rows[0]) throw new Error('User not found in MPLOS');
        req.user = { attributes: dbRes.rows[0] };
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
