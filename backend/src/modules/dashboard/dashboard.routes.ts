import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getKPIs,
  getSeries,
  getPaymentMethods,
} from './dashboard.controller';

const router = Router();
router.use(requireAuth);

router.get('/kpis', getKPIs);
router.get('/series', getSeries);
router.get('/payment-methods', getPaymentMethods);

export default router;
