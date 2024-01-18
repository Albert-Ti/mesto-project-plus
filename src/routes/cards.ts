import { Router } from 'express';
import { card } from '../controllers';

const router = Router();

router.post('/cards', card.create);
router.get('/cards', card.getAll);
router.get('/cards/:id', card.getById);

router.put('/cards/:id/likes', card.like);
router.delete('/cards/:id/likes', card.dislike);

export default router;
