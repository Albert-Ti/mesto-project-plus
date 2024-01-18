import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { STATUS_CODE } from '../constants';
import CardModel from '../models/card';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user;

    const newCard = await CardModel.create({ name, link, owner });

    if (!newCard) {
      return res
        .status(STATUS_CODE['bad-request'])
        .json({ message: 'Не удалось создать карточку' });
    }

    return res.status(STATUS_CODE.created).json(newCard);
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find({});

    if (cards.length === 0) {
      return res
        .status(STATUS_CODE['not-found'])
        .json({ message: 'Нет доступных карточек, попробуйте создать' });
    }

    return res.status(STATUS_CODE.ok).json(cards);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardById = await CardModel.findById({ _id: req.params.id });

    if (!cardById) {
      return res.status(STATUS_CODE['not-found']).json({ message: 'Карточка не найдена' });
    }

    return res.status(STATUS_CODE.ok).json(cardById);
  } catch (error) {
    return next(error);
  }
};

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params.id;
    if (!cardId || !Types.ObjectId.isValid(cardId)) {
      return res
        .status(STATUS_CODE['bad-request'])
        .json({ message: 'Переданы некорректные данные для постановки лайка.' });
    }

    const updateCard = await CardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updateCard) {
      return res.status(STATUS_CODE['not-found']).json({ message: 'Карточка не найдена' });
    }

    return res.status(STATUS_CODE.ok).json(updateCard);
  } catch (error) {
    return next(error);
  }
};

export const dislike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params.id;
    if (!cardId || !Types.ObjectId.isValid(cardId)) {
      return res
        .status(STATUS_CODE['bad-request'])
        .json({ message: 'Переданы некорректные данные для удаление лайка.' });
    }

    const updateCard = await CardModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updateCard) {
      return res.status(STATUS_CODE['not-found']).json({ message: 'Карточка не найдена' });
    }

    return res.status(STATUS_CODE.ok).json(updateCard);
  } catch (error) {
    return next(error);
  }
};
