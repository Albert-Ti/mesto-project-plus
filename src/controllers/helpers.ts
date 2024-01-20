import { Response } from 'express';
import { STATUS_CODE } from '../constants';

export const handleValidationError = (res: Response, message: string) =>
  res.status(STATUS_CODE.badRequest).json({ message });

export const handleCastError = (res: Response) =>
  res.status(STATUS_CODE.badRequest).json({ message: 'Передан не валидный _id' });

export const handleCardNotFound = (res: Response) =>
  res.status(STATUS_CODE.notFound).json({ message: 'Карточка по указанному _id не найдена.' });

export const handleUserNotFound = (res: Response) =>
  res.status(STATUS_CODE.notFound).json({ message: 'Пользователь по указанному _id не найден.' });
