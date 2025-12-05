const express = require('express');
const cognito = require('../modules/cognito');
const router = express.Router();



// Sign up route
router.post('/signup', async (req, res) => {
  try {
    const result = await cognito.signUp(req.body.email, req.body.password);
    console.log(result)
    res.json(result);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message });
  }
});



// Confirm signup route
router.post('/confirm', async (req, res) => {
  try {
    await cognito.confirmSignUp(req.body.email, req.body.code);
    res.json({ message: 'Email confirmed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Sign in route
router.post('/login', async (req, res) => {
  try {
    const tokens = await cognito.signIn(req.body.email, req.body.password);
    // Decode to get user ID
    const decoded = cognito.decodeToken(tokens.accessToken);
    // Hydrate from RDS
    const user = await db.query('SELECT * FROM users WHERE cognito_id = $1', [decoded.sub]);
    res.json({
      tokens,
      user: user.rows[0]
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
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
