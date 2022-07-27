const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

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
        res.send({ message: 'пользователь уже существует' });
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then(() => res.send({ name, email }))
          .catch(next);
      }
    });
};

// возвращает информацию о пользователе
const getUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.send({ message: 'пользователь не найден' });
      }
      res.send({ user });
    })
    .catch(next);
};

// обновляет информацию о пользователе
const updateUser = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { email, password },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
    .then((user) => {
      if (!user) {
        res.send({ message: 'пользователь не найден' });
      }
      res.send({ user });
    })
    .catch(next);
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
      res.send({ message: 'Все прошло успешно!' });
    })
    .catch(() => {
      res.send({ message: 'Неправильный email или пароль' });
    })
    .catch(next);
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
