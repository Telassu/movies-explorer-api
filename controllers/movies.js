const Movie = require('../models/movie');

// возвращает сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie
    .find(req.owner)
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм
const createMovie = (req, res) => {
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
    .catch((err) => res.send({ err }));
};

// удаляет сохранённый фильм
const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        res.send({ message: 'Карточка не найдена' });
      }
      if (movie.owner.toString() !== req.user._id) {
        res.send({ message: 'Недостаточно прав для удаления карточки' });
      }
      Movie.findByIdAndRemove(req.params.id)
        .then(() => res.send({ message: 'Карточка успешно удалена' }))
        .catch(next);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
