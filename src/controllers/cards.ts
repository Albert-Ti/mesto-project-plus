import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { STATUS_CODE } from '../constants';
import CardModel from '../models/card';
import * as helpers from './helpers';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user;

    const newCard = await CardModel.create({ name, link, owner });

    return res.status(STATUS_CODE.created).json(newCard);
  } catch (error) {
    if ((error as MongooseError).name === 'ValidationError') {
      return helpers.handleValidationError(
        res,
        'Переданы некорректные данные при создании карточки',
      );
    }
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find({});

    return res.status(STATUS_CODE.ok).json(cards);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardById = await CardModel.findById(req.params.id).orFail();

    return res.status(STATUS_CODE.ok).json(cardById);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleCardNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      return helpers.handleCastError(res);
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

    return res.status(STATUS_CODE.ok).json(updatedCard);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleCardNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      helpers.handleCastError(res);
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

    return res.status(STATUS_CODE.ok).json(updatedCard);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleCardNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      return helpers.handleCastError(res);
    }
    return next(error);
  }
};
