import { Router } from 'express';
import { z } from 'zod';
import { login } from './auth.service';

const router = Router();

const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const result = await login(parsed.data.email, parsed.data.password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
