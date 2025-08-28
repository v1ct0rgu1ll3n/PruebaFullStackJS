import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma';
import { getPagination } from '../../utils/pagination';
import { z } from 'zod';

// Esquema Zod para creación de producto
const CreateProductDto = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().min(0),
  category: z.string().min(1),
});

// Esquema Zod para actualización de producto
const UpdateProductDto = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  category: z.string().min(1).optional(),
});

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, page, pageSize } = getPagination(req.query);
    const [products, total] = await Promise.all([
      prisma.products.findMany({ skip, take }),
      prisma.products.count(),
    ]);

    res.json({ data: products, meta: { total, page, pageSize } });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({ where: { id: Number(id) } });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateProductDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const newProduct = await prisma.products.create({ data: parsed.data });
    res.status(201).json({ data: newProduct });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'SKU ya existe' });
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateProductDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { id } = req.params;
    const updated = await prisma.products.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.products.delete({ where: { id: Number(id) } });
    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
};
