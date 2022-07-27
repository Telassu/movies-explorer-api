const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {
    res.send({ message: 'Необходима авторизация!' });
  }

  const token = authorization.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res.send({ message: 'Необходима авторизация!' });
  }
  req.user = payload;

  next();
};
