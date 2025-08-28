import { Request, Response } from 'express';

export const getDashboard = async (_req: Request, res: Response) => {
  res.json({
    data: {
      message: 'Dashboard funcionando 🚀',
    },
  });
};
