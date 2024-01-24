import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { login, register } from './controllers/users';
import auth from './middlewares/auth';
import handleNotFoundPage from './middlewares/handle-not-found-page';
import handleServerError from './middlewares/handle-server-error';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', register);
app.post('/signin', login);

app.use('/', auth, userRouter);
app.use('/', auth, cardsRouter);

app.use(handleNotFoundPage);
app.use(handleServerError);

const connectToMongoDB = async () => {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => console.log('Mongodb подключен'))
    .catch(() => console.error('Ошибка подключения к Mongodb'));

  app.listen(PORT, () => console.log(`Сервер запушен: http://localhost:${PORT}`));
};

connectToMongoDB();
