import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE } from '../constants';
import UserModel from '../models/user';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await UserModel.create({
      name,
      about,
      avatar,
    });

    if (!newUser) {
      return res
        .status(STATUS_CODE['bad-request'])
        .json({ message: 'Не удалось создать пользователя.' });
    }

    return res.status(STATUS_CODE.created).json(newUser);
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({});
    if (!users) {
      return res.status(404).json({ message: 'Нет Доступных пользователей' });
    }

    return res.status(STATUS_CODE.ok).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userById = await UserModel.findById({ _id: req.params.id });

    if (!userById) {
      return res
        .status(STATUS_CODE['not-found'])
        .json({ message: 'Пользователь по указанному _id не найден.' });
    }

    return res.status(STATUS_CODE.ok).json(userById);
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );

    if (!updatedUser) {
      return res
        .status(STATUS_CODE['not-found'])
        .json({ message: 'Пользователь по указанному _id не найден.' });
    }

    return res.status(STATUS_CODE.ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true });

    if (!updatedUser) {
      return res
        .status(STATUS_CODE['not-found'])
        .json({ message: 'Пользователь по указанному _id не найден.' });
    }

    return res.status(STATUS_CODE.ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};
