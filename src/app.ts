import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import handleServerError from './middlewares/handle-server-error';
import handleNotFoundPage from './middlewares/handle-not-found-page';
import setUserTypeInRequest from './middlewares/set-user-type-in-request';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000, MONGODB_URL = '' } = process.env;

const app = express();

app.use(express.json());
app.use(setUserTypeInRequest);

app.use('/', userRouter);
app.use('/', cardsRouter);

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
