import { celebrate, errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { login, register } from './controllers/users';
import { auth, logger, validation } from './middlewares';
import * as customErrors from './middlewares/custom-errors';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(logger.requestLog);

app.post('/signup', celebrate(validation.authUser), register);
app.post('/signin', celebrate(validation.authUser), login);

app.use('/', auth, userRouter);
app.use('/', auth, cardsRouter);

app.use(logger.errorLog);

app.use(errors());

app.use(customErrors.handleNotFoundPage);
app.use(customErrors.handleServerError);

const connectToMongoDB = async () => {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => console.log('Mongodb подключен'))
    .catch(() => console.error('Ошибка подключения к Mongodb'));

  app.listen(PORT, () => console.log(`Сервер запушен: http://localhost:${PORT}`));
};

connectToMongoDB();
