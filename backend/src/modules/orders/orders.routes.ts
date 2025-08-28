import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from './orders.controller';

const router = Router();

// Todos los endpoints requieren JWT
router.use(requireAuth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
