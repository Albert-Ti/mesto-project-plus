import { celebrate } from 'celebrate';
import { Router } from 'express';
import { cards } from '../controllers';
import { validation } from '../middlewares';

const router = Router();

router.post('/cards', celebrate(validation.cards), cards.create);
router.get('/cards', cards.getAll);
router.get('/cards/:id', celebrate(validation.ID), cards.getById);

router.put('/cards/:id/likes', celebrate(validation.ID), cards.like);
router.delete('/cards/:id/likes', celebrate(validation.ID), cards.dislike);
router.delete('/cards/:id', celebrate(validation.ID), cards.remove);

export default router;
