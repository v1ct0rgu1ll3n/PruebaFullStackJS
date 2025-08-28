import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
// ... importar otras rutas
import { errorHandler } from './middleware/error';
import productRoutes from './modules/products/products.routes';
import usersRoutes from './modules/users/users.routes'; 
import customersRoutes from './modules/customers/customers.routes';
import ordersRoutes from './modules/orders/orders.routes';

const app = express();
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/v1/health', (_req, res) => res.json({ data: { status: 'ok' } }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
// app.use('/api/v1/orders', ordersRoutes) // opcional mostrar algunos
app.use('/api/v1/products', productRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/orders', ordersRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});

export default app;
