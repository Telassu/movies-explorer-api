const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const regex = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;

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
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(regex),
    movieId: Joi.number().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), deleteMovie);

module.exports = router;
