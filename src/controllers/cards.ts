import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { STATUS_CODES } from '../constants';
import CardModel from '../models/card';
import * as errors from '../errors';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user;

    const newCard = await CardModel.create({ name, link, owner });

    return res.status(STATUS_CODES.created).json(newCard);
  } catch (error) {
    if ((error as MongooseError).name === 'ValidationError') {
      return next(
        new errors.BadRequestError('Переданы некорректные данные при создании карточки.'),
      );
    }
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find({}).populate('likes', 'email -_id');

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
      return next(new errors.NotFoundError('Карточка по указанному ID не найдена.'));
    }

    if ((error as MongooseError).name === 'CastError') {
      return next(new errors.BadRequestError('Передан не валидный ID.'));
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
      return next(new errors.NotFoundError('Карточка по указанному ID не найдена.'));
    }

    if ((error as MongooseError).name === 'CastError') {
      return next(new errors.BadRequestError('Передан не валидный ID.'));
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
      return next(new errors.NotFoundError('Карточка по указанному ID не найдена.'));
    }

    if ((error as MongooseError).name === 'CastError') {
      return next(new errors.BadRequestError('Передан не валидный ID.'));
    }
    return next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardToRemove = await CardModel.findById(req.params.id).orFail();

    if (cardToRemove.owner.toString() !== req.user._id.toString()) {
      return next(new errors.ForbiddenError('У вас нет доступа.'));
    }

    await cardToRemove.deleteOne();

    return res.status(STATUS_CODES.ok).json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return next(new errors.NotFoundError('Карточка по указанному ID не найдена.'));
    }
    return next(error);
  }
};
