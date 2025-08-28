import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma';
import { config } from '../../config/env';

export async function login(email: string, password: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  const token = jwt.sign({ sub: user.id, role: user.role, email }, config.JWT_SECRET, { expiresIn: '60m' });
  return { token };
}
