const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/Unauthorized');
const { errAuth } = require('../utils/const');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized(errAuth));
  }
  req.user = payload;

  next();
};
