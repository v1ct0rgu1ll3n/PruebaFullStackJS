import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { z } from 'zod';

// Rango de fechas
const Range = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// Helper para filtrar por fecha
function dateWhere(from?: string, to?: string) {
  if (!from && !to) return {};
  return {
    order_date: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
  };
}

// KPIs generales
export const getKPIs = async (req: Request, res: Response) => {
  try {
    const { from, to } = Range.partial().parse(req.query);
    const where = dateWhere(from, to);

    const [sum, count, top] = await Promise.all([
      prisma.orders.aggregate({ _sum: { total_amount: true }, where }),
      prisma.orders.count({ where }),
      prisma.order_items.groupBy({
        by: ['product_id'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const totalSales = sum._sum.total_amount ?? 0;
    const ordersCount = count;
    const avgTicket = ordersCount ? Number(totalSales) / ordersCount : 0;

    const productIds = top.map(t => t.product_id);
    const prods = await prisma.products.findMany({ where: { id: { in: productIds } } });

    const topProducts = top.map(t => ({
      product: prods.find(p => p.id === t.product_id)?.name ?? `#${t.product_id}`,
      quantity: Number(t._sum.quantity),
    }));

    res.json({ data: { totalSales: Number(totalSales), ordersCount, avgTicket, topProducts } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo KPIs' });
  }
};

// Serie temporal de ventas
export const getSeries = async (req: Request, res: Response) => {
  try {
    const Group = z.enum(['day', 'month']);
    const groupBy = Group.parse((req.query.groupBy ?? 'day').toString());
    const { from, to } = Range.partial().parse(req.query);
    const fmt = groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m';

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT DATE_FORMAT(order_date, ?) as bucket, SUM(total_amount) as sales
      FROM orders
      ${from || to ? 'WHERE order_date BETWEEN ? AND ?' : ''}
      GROUP BY bucket
      ORDER BY bucket ASC
      `,
      fmt,
      ...(from || to ? [from ?? '1970-01-01', to ?? '2999-12-31'] : [])
    );

    res.json({ data: rows.map(r => ({ bucket: r.bucket, sales: Number(r.sales) })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo series' });
  }
};

// Métodos de pago
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const { from, to } = Range.partial().parse(req.query);
    const where = dateWhere(from, to);

    const rows = await prisma.orders.groupBy({
      by: ['payment_method'],
      _sum: { total_amount: true },
      where,
    });

    res.json({
      data: rows.map(r => ({ method: r.payment_method, amount: Number(r._sum.total_amount) })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo métodos de pago' });
  }
};
