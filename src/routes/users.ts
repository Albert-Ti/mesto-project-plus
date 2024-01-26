import { celebrate } from 'celebrate';
import { Router } from 'express';
import { validation } from '../middlewares';
import { user } from '../controllers';

const router = Router();

router.get('/users/me', user.getMe);

router.get('/users', user.getAll);
router.get('/users/:id', celebrate(validation.ID), user.getById);

router.patch('/users/me', celebrate(validation.updateUser), user.updateProfile);
router.patch('/users/me/avatar', celebrate(validation.updateUser), user.updateAvatar);

export default router;
