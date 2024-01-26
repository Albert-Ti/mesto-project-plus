import { celebrate } from 'celebrate';
import { Router } from 'express';
import { card } from '../controllers';
import { validation } from '../middlewares';

const router = Router();

router.post('/cards', celebrate(validation.cards), card.create);
router.get('/cards', card.getAll);
router.get('/cards/:id', celebrate(validation.ID), card.getById);

router.put('/cards/:id/likes', celebrate(validation.ID), card.like);
router.delete('/cards/:id/likes', celebrate(validation.ID), card.dislike);
router.delete('/cards/:id', celebrate(validation.ID), card.remove);

export default router;
