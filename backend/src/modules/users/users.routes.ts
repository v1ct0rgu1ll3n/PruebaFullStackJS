import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma';
import { z } from 'zod';
import { getUsers } from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
});

// Crear usuario
router.post('/register', async (req, res, next) => {
  try {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.users.create({
      data: {
        email: parsed.data.email,
        password_hash: hashedPassword,
        role: parsed.data.role,
      },
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
});

// Obtener todos los usuarios (requiere JWT)
router.get('/', requireAuth, getUsers);

export default router;
