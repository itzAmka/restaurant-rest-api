import express, { Express } from 'express';
import dotenv from 'dotenv';

/* ------- middlewares imports ------ */
import { errorMiddleware } from './middlewares/error-middleware';

/* --------- routes imports --------- */
import adminProfileRoutes from './routes/admin/profile-routes';
import adminAuthRoutes from './routes/admin/auth-routes';
import adminOrderRoutes from './routes/admin/order-routes';
import adminMenuRoutes from './routes/admin/menu-routes';
import adminOrderItemRoutes from './routes/admin/order-item-routes';
import adminCustomerRoutes from './routes/admin/customer-routes';
import adminCategoryRoutes from './routes/admin/category-routes';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app: Express = express();

/* -------- middlewares setup -------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ----------- routes setup ---------- */
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

// admin routes
app.use('/api/v1/admin/profile', adminProfileRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/admin/orders', adminOrderRoutes);
app.use('/api/v1/admin/menu', adminMenuRoutes);
app.use('/api/v1/admin/order-item', adminOrderItemRoutes);
app.use('/api/v1/admin/customers', adminCustomerRoutes);
app.use('/api/v1/admin/category', adminCategoryRoutes);

/* -------- handle 404 errors ------- */
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Not found ',
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});

/* -------- error middleware -------- */
app.use(errorMiddleware);

app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
