import { Router } from 'express';
import { user } from '../controllers';

const router = Router();

router.post('/users', user.create);
router.get('/users', user.getAll);
router.get('/users/:id', user.getById);

router.patch('/users/me', user.updateProfile);
router.patch('/users/me/avatar', user.updateAvatar);

export default router;
