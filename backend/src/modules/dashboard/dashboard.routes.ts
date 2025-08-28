import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { prisma } from '../../db/prisma';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const Range = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

function dateWhere(q: any, from?: string, to?: string) {
  if (!from && !to) return {};
  return {
    order_date: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined
    }
  };
}

router.get('/kpis', async (req, res) => {
  const { from, to } = Range.partial().parse(req.query);
  const where = dateWhere({}, from as any, to as any);
  const [sum, count, top] = await Promise.all([
    prisma.orders.aggregate({ _sum: { total_amount: true }, where }),
    prisma.orders.count({ where }),
    prisma.order_items.groupBy({
      by: ['product_id'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ]);
  const totalSales = sum._sum.total_amount ?? 0;
  const ordersCount = count;
  const avgTicket = ordersCount ? Number(totalSales) / ordersCount : 0;

  // Top 5 productos por cantidad
  const productIds = top.map(t => t.product_id);
  const prods = await prisma.products.findMany({ where: { id: { in: productIds } }});
  const topProducts = top.map(t => ({
    product: prods.find(p => p.id === t.product_id)?.name ?? `#${t.product_id}`,
    quantity: Number(t._sum.quantity)
  }));

  res.json({ data: { totalSales: Number(totalSales), ordersCount, avgTicket, topProducts } });
});

// Serie temporal (por día o mes)
router.get('/series', async (req, res) => {
  const Group = z.enum(['day','month']);
  const groupBy = Group.parse((req.query.groupBy ?? 'day').toString());
  const { from, to } = Range.partial().parse(req.query);
  const where = dateWhere({}, from as any, to as any);

  // Prisma no tiene groupBy por date trunc nativo; usa raw SQL:
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
});

// Dona métodos de pago
router.get('/payment-methods', async (req, res) => {
  const { from, to } = Range.partial().parse(req.query);
  const where = dateWhere({}, from as any, to as any);
  const rows = await prisma.orders.groupBy({
    by: ['payment_method'],
    _sum: { total_amount: true },
    where
  });
  res.json({ data: rows.map(r => ({ method: r.payment_method, amount: Number(r._sum.total_amount) })) });
});

export default router;
