const cognitoService = require('../modules/cognito');
const pool = require('../modules/pool');


const authMiddleware = async (req, res, next) => {
    const NODE_ENV = process.env.NODE_ENV;
    if(NODE_ENV === 'production')
        handleCognito(req, res, next);
    if(NODE_ENV === 'develop')
        handleLocalAuth(req, res, next);
};

const handleLocalAuth = async (req, res, next) =>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        if(!token) throw new Error('sheeiiitttt');
        const dbRes = await pool.query(`
            SELECT
                *,
                users.id AS mlpos_id,
                users.account_id AS mplos_account_id
            FROM
                users
            LEFT JOIN accounts_stripe
            ON
                accounts_stripe.account_id = users.account_id
            WHERE email = $1`
            , [token]);
        if(!dbRes.rows[0]) throw new Error('sheeiiitttt');
        req.user = {
            attributes: dbRes.rows[0]
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}

const handleCognito = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const user = await cognitoService.getUser(token);
        const dbRes = await pool.query('SELECT id FROM users WHERE email = $1', [user.attributes.email]);
        user.attributes.mlpos_id = dbRes.rows[0].id;
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware;