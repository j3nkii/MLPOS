// Install: npm install @aws-sdk/client-cognito-identity-provider

const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand
} = require('@aws-sdk/client-cognito-identity-provider');

// Works in both Lambda and local dev
const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-2'
});

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// ============================================
// SIGN UP
// ============================================
async function signUp(email, password) {
  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email }
    ]
  });

  const result = await cognito.send(command);
  return {
    userSub: result.UserSub,
    userConfirmed: result.UserConfirmed
  };
}

// ============================================
// CONFIRM SIGN UP (with code from email)
// ============================================
async function confirmSignUp(email, code) {
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code
  });

  await cognito.send(command);
  return { confirmed: true };
}

// ============================================
// SIGN IN
// ============================================
async function signIn(email, password) {
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  const result = await cognito.send(command);
  
  return {
    accessToken: result.AuthenticationResult.AccessToken,
    idToken: result.AuthenticationResult.IdToken,
    refreshToken: result.AuthenticationResult.RefreshToken,
    expiresIn: result.AuthenticationResult.ExpiresIn
  };
}

// ============================================
// REFRESH TOKEN
// ============================================
async function refreshToken(refreshToken) {
  const command = new InitiateAuthCommand({
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken
    }
  });

  const result = await cognito.send(command);
  
  return {
    accessToken: result.AuthenticationResult.AccessToken,
    idToken: result.AuthenticationResult.IdToken,
    expiresIn: result.AuthenticationResult.ExpiresIn
  };
}

// ============================================
// GET USER (from access token)
// ============================================
async function getUser(accessToken) {
  const command = new GetUserCommand({
    AccessToken: accessToken
  });

  const result = await cognito.send(command);
  
  // Parse attributes into object
  const attributes = {};
  result.UserAttributes.forEach(attr => {
    attributes[attr.Name] = attr.Value;
  });

  return {
    username: result.Username,
    attributes,
    sub: attributes.sub // Cognito user ID
  };
}

// ============================================
// FORGOT PASSWORD (sends reset code to email)
// ============================================
async function forgotPassword(email) {
  const command = new ForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email
  });

  const result = await cognito.send(command);
  
  return {
    codeDeliveryDetails: result.CodeDeliveryDetails
  };
}

// ============================================
// CONFIRM PASSWORD RESET (with code from email)
// ============================================
async function confirmPassword(email, code, newPassword) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword
  });

  await cognito.send(command);
  return { success: true };
}

// ============================================
// VERIFY TOKEN (decode without calling Cognito)
// ============================================
function decodeToken(token) {
  // Simple JWT decode (doesn't verify signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }
  
  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64').toString('utf8')
  );
  
  return {
    sub: payload.sub,           // User ID
    email: payload.email,
    exp: payload.exp,           // Expiration timestamp
    iat: payload.iat,           // Issued at
    token_use: payload.token_use // 'access' or 'id'
  };
}

module.exports = {
  signUp,
  confirmSignUp,
  signIn,
  refreshToken,
  getUser,
  forgotPassword,
  confirmPassword,
  decodeToken
};

// ============================================
// EXAMPLE USAGE IN YOUR ROUTES
// ============================================

/*
const auth = require('./cognito');

// Sign up route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const result = await auth.signUp(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Confirm signup route
app.post('/api/auth/confirm', async (req, res) => {
  try {
    await auth.confirmSignUp(req.body.email, req.body.code);
    res.json({ message: 'Email confirmed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sign in route
app.post('/api/auth/login', async (req, res) => {
  try {
    const tokens = await auth.signIn(req.body.email, req.body.password);
    
    // Decode to get user ID
    const decoded = auth.decodeToken(tokens.accessToken);
    
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
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    await auth.forgotPassword(req.body.email);
    res.json({ message: 'Check email for reset code' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reset password route
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    await auth.confirmPassword(req.body.email, req.body.code, req.body.newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
*/