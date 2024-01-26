import { celebrate } from 'celebrate';
import { Router } from 'express';
import { card } from '../controllers';
import { validation } from '../middlewares';

const router = Router();

router.post('/cards', celebrate(validation.cards), card.create);
router.get('/cards', card.getAll);
router.get('/cards/:id', card.getById);

router.put('/cards/:id/likes', card.like);
router.delete('/cards/:id/likes', card.dislike);
router.delete('/cards/:id', card.remove);

export default router;
