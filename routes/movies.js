const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const regex = require('../utils/const');

// возвращает все сохранённые текущим пользователем фильмы
router.get('/movies', getMovies);

// создаёт фильм
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(RegExp(regex)),
    trailerLink: Joi.string().required().pattern(RegExp(regex)),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(RegExp(regex)),
    movieId: Joi.string().length(24).hex().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), deleteMovie);

module.exports = router;
