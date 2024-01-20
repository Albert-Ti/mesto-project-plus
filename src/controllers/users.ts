import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { STATUS_CODE } from '../constants';
import UserModel from '../models/user';
import * as helpers from './helpers';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await UserModel.create({
      name,
      about,
      avatar,
    });

    return res.status(STATUS_CODE.created).json(newUser);
  } catch (error) {
    if ((error as MongooseError).name === 'ValidationError') {
      return helpers.handleValidationError(
        res,
        'Переданы некорректные данные при создании пользователя.',
      );
    }
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({});

    return res.status(STATUS_CODE.ok).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userById = await UserModel.findById(req.params.id).orFail();

    return res.status(STATUS_CODE.ok).json(userById);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleUserNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      return helpers.handleCastError(res);
    }

    return next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail();

    return res.status(STATUS_CODE.ok).json(updatedUser);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleUserNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      return helpers.handleCastError(res);
    }

    if ((error as MongooseError).name === 'ValidationError') {
      return helpers.handleValidationError(
        res,
        'Переданы некорректные данные при обновлении профиля.',
      );
    }
    return next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail();

    return res.status(STATUS_CODE.ok).json(updatedUser);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return helpers.handleUserNotFound(res);
    }

    if ((error as MongooseError).name === 'CastError') {
      return helpers.handleCastError(res);
    }

    if ((error as MongooseError).name === 'ValidationError') {
      return helpers.handleValidationError(
        res,
        'Переданы некорректные данные при обновлении аватара.',
      );
    }
    return next(error);
  }
};
