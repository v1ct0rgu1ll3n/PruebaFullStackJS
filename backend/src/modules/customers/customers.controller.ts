import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma';
import { getPagination } from '../../utils/pagination';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { skip, take, page, pageSize } = getPagination(req.query);

    const [customers, total] = await Promise.all([
      prisma.customers.findMany({ skip, take }),
      prisma.customers.count(),
    ]);

    res.json({
      data: customers,
      meta: { total, page, pageSize },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo clientes' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await prisma.customers.findUnique({ where: { id: Number(id) } });

  if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });

  res.json({ data: customer });
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  try {
    const newCustomer = await prisma.customers.create({ data: { name, email } });
    res.status(201).json({ data: newCustomer });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email ya existe' });
    }
    next(err); // pasa el error al middleware global
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updated = await prisma.customers.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.json({ data: updated });
  } catch (err) {
    next(err); // pasa el error al middleware global
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.customers.delete({ where: { id: Number(id) } });
    res.json({ message: 'Cliente eliminado correctamente', data: deleted });
  } catch {
    res.status(404).json({ error: 'Cliente no encontrado o error al eliminar' });
  }
};
