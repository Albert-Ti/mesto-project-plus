import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { STATUS_CODES } from '../constants';
import CardModel from '../models/card';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user;

    const newCard = await CardModel.create({ name, link, owner });

    return res.status(STATUS_CODES.created).json(newCard);
  } catch (error) {
    if ((error as MongooseError).name === 'ValidationError') {
      return res
        .status(STATUS_CODES.badRequest)
        .json({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardToRemove = await CardModel.findById(req.params.id).orFail();

    if (cardToRemove.owner.toString() !== req.user._id.toString()) {
      return res.status(STATUS_CODES.notFound).send({ message: 'У вас нет доступа' });
    }

    await cardToRemove.deleteOne();

    return res.status(STATUS_CODES.ok).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.notFound)
        .json({ message: 'Карточка по указанному _id не найдена.' });
    }
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find({}).populate('owner', 'name');

    return res.status(STATUS_CODES.ok).json(cards);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardById = await CardModel.findById(req.params.id).orFail();

    return res.status(STATUS_CODES.ok).json(cardById);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.notFound)
        .json({ message: 'Карточка по указанному _id не найдена.' });
    }

    if ((error as MongooseError).name === 'CastError') {
      return res.status(STATUS_CODES.badRequest).json({ message: 'Передан не валидный _id' });
    }

    return next(error);
  }
};

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCard = await CardModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    ).orFail();

    return res.status(STATUS_CODES.ok).json(updatedCard);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.notFound)
        .json({ message: 'Карточка по указанному _id не найдена.' });
    }

    if ((error as MongooseError).name === 'CastError') {
      return res.status(STATUS_CODES.badRequest).json({ message: 'Передан не валидный _id' });
    }
    return next(error);
  }
};

export const dislike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCard = await CardModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();

    return res.status(STATUS_CODES.ok).json(updatedCard);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return res
        .status(STATUS_CODES.notFound)
        .json({ message: 'Карточка по указанному _id не найдена.' });
    }

    if ((error as MongooseError).name === 'CastError') {
      return res.status(STATUS_CODES.badRequest).json({ message: 'Передан не валидный _id' });
    }
    return next(error);
  }
};
