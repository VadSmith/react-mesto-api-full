require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  if (!token) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    // return next(err);
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
