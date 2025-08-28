import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma';
import { getPagination } from '../../utils/pagination';
import { z } from 'zod';

// Esquema Zod para creación de orden
const CreateOrderDto = z.object({
  customer_id: z.number(),
  order_date: z.string(),
  status: z.enum(['pending','paid','cancelled']),
  payment_method: z.enum(['cash','card','transfer','wallet']),
  items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number().min(1),
      unit_price: z.number().min(0)
    })
  )
});

// Esquema Zod para actualización de orden
const UpdateOrderDto = z.object({
  status: z.enum(['pending','paid','cancelled']).optional(),
  payment_method: z.enum(['cash','card','transfer','wallet']).optional(),
});

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, page, pageSize } = getPagination(req.query);
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        skip,
        take,
        include: { items: true, customer: true },
      }),
      prisma.orders.count(),
    ]);

    res.json({ data: orders, meta: { total, page, pageSize } });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findUnique({
      where: { id: Number(id) },
      include: { items: true, customer: true },
    });

    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateOrderDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const order = await prisma.orders.create({
      data: {
        customer_id: parsed.data.customer_id,
        order_date: new Date(parsed.data.order_date),
        status: parsed.data.status,
        payment_method: parsed.data.payment_method,
        total_amount: parsed.data.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0),
        items: {
          create: parsed.data.items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateOrderDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { id } = req.params;

    const updated = await prisma.orders.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.orders.delete({ where: { id: Number(id) } });
    res.json({ message: 'Orden eliminada correctamente', data: deleted });
  } catch (err) {
    next(err);
  }
};
