import { Router } from 'express';
import { user } from '../controllers';

const router = Router();

router.get('/users/me', user.getMe);

router.get('/users', user.getAll);
router.get('/users/:id', user.getById);

router.patch('/users/me', user.updateProfile);
router.patch('/users/me/avatar', user.updateAvatar);

export default router;
