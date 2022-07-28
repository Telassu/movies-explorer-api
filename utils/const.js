const corsOrigin = [
  'http://api.chuhonina.cinema.nomoredomains.xyz',
  'https://api.chuhonina.cinema.nomoredomains.xyz',
  'http://chuhonina.cinema.nomoredomains.xyz',
  'https://chuhonina.cinema.nomoredomains.xyz',
];

const regexUrl = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;
const regexRuName = /^[?!,.а-яА-ЯёЁ0-9\s]+$/;
const regexEngName = /^[?!,.a-zA-Z0-9\s]+$/;

module.exports = {
  corsOrigin,
  regexUrl,
  regexRuName,
  regexEngName,
};
