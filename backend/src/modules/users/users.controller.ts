import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.users.findMany();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};
