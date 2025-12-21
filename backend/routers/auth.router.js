const express = require('express');
const cognito = require('../modules/cognito');
const pool = require('../modules/pool');
const router = express.Router();

const { MPLOSerr } = require('../modules/errHandle')



// // Sign up route
// router.post('/signup', async (req, res) => {
//   try {
//     await pool.query(`
//         INSERT INTO users (username, email)
//         VALUES ($1, $1)
//       `, [req.body.email]);
//     const result = await cognito.signUp(req.body.email, req.body.password);
//     console.log(result)
//     res.json(result);
//   } catch (err) {
//     console.error(err)
//     res.status(400).json({ error: err.message });
//   }
// });



// Confirm signup route
router.post('/confirm', async (req, res) => {
  try {
    const cogRes = await cognito.confirmSignUp(req.body.email, req.body.code);
    console.log(cogRes)
    res.json({ message: 'Email confirmed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Sign in route
router.post('/login', async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [req.body.email]);
    if(!user.rows[0]){
      const client = await pool.connect();
      await client.query('BEGIN;')
      await client.query(`
          INSERT INTO users (username, email)
          VALUES ($1, $1)
        `, [req.body.email]);
      const result = await cognito.signUp(req.body.email, req.body.password);
      await client.query('COMMIT;');
      await client.end();
      res.json(result);
    }
    const tokens = await cognito.signIn(req.body.email, req.body.password);
    if(!tokens.success) return res.status(401).json(tokens)
    res.json({
      tokens,
      user: user.rows[0]
    });
  } catch (err) {
    console.error(err);
    if(err.customErr){
      res.status(403).json({ ...err, message: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});



router.post('/get-user', async (req, res) => {
  try {
    const cogres = await cognito.getUser(req.body.accessToken);
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [cogres.attributes.email]);
    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
});


// Forgot password route
router.post('/forgot', async (req, res) => {
  try {
    await cognito.forgotPassword(req.body.email);
    res.json({ message: 'Check email for reset code' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Reset password route
router.post('/reset', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    await cognito.confirmPassword(email, code, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
