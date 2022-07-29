const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFound = require('../errors/NotFound');
const { errNotFound, successfull } = require('../utils/const');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use('/', require('./users'));
router.use('/', require('./movies'));

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send(successfull);
});

router.use('/*', () => {
  throw new NotFound(errNotFound);
});

module.exports = router;
