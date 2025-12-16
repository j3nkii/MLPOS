// Install: npm install @aws-sdk/client-cognito-identity-provider

const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { MPLOSerr } = require('./errHandle');



// Works in both Lambda and local dev
const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-2'
});



const CLIENT_ID = process.env.COGNITO_CLIENT_ID;



// ============================================
// SIGN UP
// ============================================
async function signUp(email, password) {
  const command = new SignUpCommand
  ({
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
  const cogres = await cognito.send(command);
  console.log(cogres);
  return cogres;
}

// ============================================
// RESEND CONFIRMATION CODE
// ============================================
async function resendConfirmationCode(email) {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email
    });
    const result = await cognito.send(command);
    return {
      success: true,
      message: 'Confirmation code sent successfully',
      destination: result.CodeDeliveryDetails.Destination,
      deliveryMedium: result.CodeDeliveryDetails.DeliveryMedium
    };
  } catch (error) {
    if (error.name === 'LimitExceededException') {
      return {
        success: false,
        message: 'Too many requests. Please wait before trying again.'
      };
    } else if (error.name === 'InvalidParameterException') {
      return {
        success: false,
        message: 'User is already confirmed'
      };
    } else if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        message: 'User not found'
      };
    }
    throw error;
  }
}



// ============================================
// SIGN IN
// ============================================
async function signIn(email, password) {
  try {
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
  } catch (error) {
    if (error.name === 'UserNotConfirmedException') {
      resendConfirmationCode(email);
      const metadata = {
        success: false,
        needsConfirmation: true,
        email: email,
      }
      throw new MPLOSerr('Please confirm your account', metadata);
    } else if (error.name === 'NotAuthorizedException') {
      return {
        success: false,
        message: 'Incorrect username or password'
      };
    } else if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        message: 'User not found'
      };
    } else throw error;
  }

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
