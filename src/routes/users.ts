import { celebrate } from 'celebrate';
import { Router } from 'express';
import { validation } from '../middlewares';
import { users } from '../controllers';

const router = Router();

router.get('/users/me', users.getMe);

router.get('/users', users.getAll);
router.get('/users/:id', celebrate(validation.ID), users.getById);

router.patch('/users/me', celebrate(validation.updateUser), users.updateProfile);
router.patch('/users/me/avatar', celebrate(validation.updateUser), users.updateAvatar);

export default router;
