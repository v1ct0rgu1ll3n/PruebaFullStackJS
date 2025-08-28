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

app.use(errorHandler);

export default app;
