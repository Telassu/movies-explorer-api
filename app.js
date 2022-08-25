require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const { mongodbAdress } = require('./utils/const');
const errorHandler = require('./middlewares/errorHandler');

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://api.chuhonina.cinema.nomoredomains.xyz',
    'https://api.chuhonina.cinema.nomoredomains.xyz',
    'http://chuhonina.cinema.nomoredomains.xyz',
    'https://chuhonina.cinema.nomoredomains.xyz',
  ],
  credentials: true,
};
const { PORT = 3001, NODE_ENV, DB_CONNECT } = process.env;

const app = express();

app.use('*', cors(options));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECT : mongodbAdress, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
