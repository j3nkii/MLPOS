const cognitoService = require('../modules/cognito');
const pool = require('../modules/pool');


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const user = await cognitoService.getUser(token);
        const dbRes = await pool.query('SELECT id FROM users WHERE email = $1', [user.attributes.email]);
        user.attributes.mlpos_id = dbRes.rows[0].id;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;