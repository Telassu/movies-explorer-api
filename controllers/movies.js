const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const {
  errRequest,
  successfull,
  errMovie,
  errAccess,
} = require('../utils/const');

// возвращает сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie
    .find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errRequest));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм
const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(errMovie);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden(errAccess);
      }
      movie.remove()
        .then(() => res.send({ message: successfull }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequest(errRequest));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
