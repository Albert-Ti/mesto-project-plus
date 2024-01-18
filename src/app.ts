import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import routerUsers from './routes/users';
import routerCards from './routes/cards';
import errorHandler from './middlewares/error-handler';
import userTypeToRequest from './middlewares/user-type-to-request';

const { PORT = 3000, MONGODB_URL = '' } = process.env;

const app = express();

app.use(express.json());
app.use(userTypeToRequest);

app.use('/', routerUsers);
app.use('/', routerCards);

app.use(errorHandler);

const connect = async () => {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => console.log('Mongodb подключен'))
    .catch(() => console.error('Ошибка подключения к Mongodb'));

  app.listen(PORT, () => console.log(`Сервер запушен: http://localhost:${PORT}`));
};

connect();
