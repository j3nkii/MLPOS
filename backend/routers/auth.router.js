const express = require('express');
const cognito = require('../modules/cognito');
const router = express.Router();



router.post('/confirm', async (req, res) => {
  try {
    const cogRes = await cognito.confirmSignUp(req.body.email, req.body.code);
    console.log(cogRes)
    res.json({ message: 'Email confirmed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



router.post('/login', async (req, res) => {
  try {
    if(process.env.NODE_ENV === 'develop'){
      res.json({
        tokens: {
          accessToken: req.body.email,
          refreshToken: req.body.email,
          idToken: req.body.email,
        },
      });
      return;
    }
    const tokens = await cognito.signIn(req.body.email, req.body.password);
    if(!tokens.success) return res.status(401).json(tokens)
    res.json({
      tokens,
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





router.post('/forgot', async (req, res) => {
  try {
    await cognito.forgotPassword(req.body.email);
    res.json({ message: 'Check email for reset code' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



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
