import { Request, Response, NextFunction } from 'express';
import { getPagination } from '../../utils/pagination';

// 🚀 temporalmente trabajaremos en memoria hasta que conectemos a DB
let products: any[] = [];

export const getProducts = (req: Request, res: Response, _next: NextFunction) => {
  const { skip, take, page, pageSize } = getPagination(req.query);
  const paginated = products.slice(skip, skip + take);

  res.json({
    data: paginated,
    meta: {
      total: products.length,
      page,
      pageSize,
    },
  });
};

export const getProductById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json({ data: product });
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);

  res.status(201).json({ data: newProduct });
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const index = products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products[index] = { ...products[index], name, price };

  res.json({ data: products[index] });
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const deleted = products.splice(index, 1);
  res.json({ data: deleted[0] });
};
