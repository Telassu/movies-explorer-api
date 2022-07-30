const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');
const {
  errEmail,
  errRequest,
  errUser,
  errReg,
  successfull,
} = require('../utils/const');

const { NODE_ENV, JWT_SECRET } = process.env;

// создает пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User
    .findOne({ email })
    .then((user) => {
      if (user) {
        next(new Conflict(errEmail));
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then(() => res.send({ name, email }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest(errRequest));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

// возвращает информацию о пользователе
const getUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound(errUser);
      }
      res.send({ user });
    })
    .catch(next);
};

// обновляет информацию о пользователе
const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound(errUser);
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errRequest));
      }
      if (err.code === 11000) {
        next(new Conflict(errEmail));
      } else {
        next(err);
      }
    });
};

// аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 360000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: successfull });
    })
    .catch(() => {
      next(new Unauthorized(errReg));
    });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
