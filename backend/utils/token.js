const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-access-secret');
  if (!accessSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not set');
  }

  return jwt.sign({ id: user._id, email: user.email }, accessSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  });
};

const generateRefreshToken = (user) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-refresh-secret');
  if (!refreshSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not set');
  }

  return jwt.sign({ id: user._id }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
