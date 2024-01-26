import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import { MongooseError } from 'mongoose';
import { STATUS_CODES } from '../constants';
import UserModel from '../models/user';
import * as errors from '../errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const newUser = await UserModel.create({ ...req.body, password: hash });

    await UserModel.init();

    return res.status(STATUS_CODES.created).json(newUser.toJSON());
  } catch (error) {
    if ((error as MongoServerError).code === 11000) {
      return next(new errors.ConflictError('Такой email уже существует.'));
    }

    if ((error as MongooseError).name === 'ValidationError') {
      return next(
        new errors.BadRequestError('Переданы некорректные данные при создании пользователя.'),
      );
    }
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password').orFail();
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new errors.UnauthorizedError('Неверная почта или пароль.');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string);
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

    return res.status(STATUS_CODES.ok).json(user.toJSON());
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return next(new errors.UnauthorizedError('Неверная почта или пароль.'));
    }
    return next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const me = await UserModel.findById(req.user._id).orFail();

    return res.status(STATUS_CODES.ok).json(me);
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({});

    return res.status(STATUS_CODES.ok).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userById = await UserModel.findById(req.params.id).orFail();

    return res.status(STATUS_CODES.ok).json(userById);
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return next(new errors.NotFoundError('Пользователь по указанному ID не найден.'));
    }

    if ((error as MongooseError).name === 'CastError') {
      return next(new errors.BadRequestError('Передан не валидный ID.'));
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

    return res.status(STATUS_CODES.ok).json(updatedUser.toJSON());
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return next(new errors.NotFoundError('Пользователь по указанному ID не найден.'));
    }

    if ((error as MongooseError).name === 'ValidationError') {
      return next(
        new errors.BadRequestError('Переданы некорректные данные при обновление профиля.'),
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

    return res.status(STATUS_CODES.ok).json(updatedUser.toJSON());
  } catch (error) {
    if ((error as MongooseError).name === 'DocumentNotFoundError') {
      return next(new errors.NotFoundError('Пользователь по указанному ID не найден.'));
    }

    if ((error as MongooseError).name === 'ValidationError') {
      return next(
        new errors.BadRequestError('Переданы некорректные данные при обновление аватара.'),
      );
    }
    return next(error);
  }
};
