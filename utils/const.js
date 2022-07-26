// сообщения
const successfull = 'Все прошло успешно!';

// ошибки
const errEmail = 'Указанный email уже существует';
const errServer = 'На сервере произошла ошибка';
const errAccess = 'Недостаточно прав для удаления';
const errAuth = 'Необходима авторизация';
const errReg = 'Неправильный email или пароль';
const errRequest = 'Переданы некорректные данные';
const errNotFound = 'Страница не найдена';
const errUser = 'Увы, пользователя не существует';
const errMovie = 'Увы, такой фильм не найден';

const regexUrl = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;
const mongodbAdress = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  regexUrl,
  errEmail,
  errServer,
  errAccess,
  errAuth,
  errReg,
  errRequest,
  errNotFound,
  errUser,
  errMovie,
  successfull,
  mongodbAdress,
};
