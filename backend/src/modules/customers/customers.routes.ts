import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customers.controller';

import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';

const router = Router();

// Todos los endpoints requieren JWT
router.use(requireAuth);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);

// Validación con Zod antes de llamar al controller
router.post('/', async (req, res, next) => {
  const parsed = CreateCustomerDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  // Pasamos los datos validados al controller
  req.body = parsed.data;
  createCustomer(req, res, next);
});

router.put('/:id', async (req, res, next) => {
  const parsed = UpdateCustomerDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  req.body = parsed.data;
  updateCustomer(req, res, next);
});

router.delete('/:id', deleteCustomer);

export default router;
