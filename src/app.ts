import { celebrate, errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { login, register } from './controllers/users';
import { auth, centralErrorHandler, logger, validation } from './middlewares';
import handleNotFoundRoute from './routes/handle-not-found-route';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(logger.requestLog);

app.post('/signup', celebrate(validation.authUser), register);
app.post('/signin', celebrate(validation.authUser), login);

app.use(auth);
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use('*', handleNotFoundRoute);

app.use(logger.errorLog);

app.use(errors());

app.use(centralErrorHandler);

const connect = async () => {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => console.log('Mongodb подключен'))
    .catch(() => console.error('Ошибка подключения к Mongodb'));

  app.listen(PORT, () => console.log(`Сервер запушен: http://localhost:${PORT}`));
};

connect();
