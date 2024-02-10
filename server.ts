import express, { Express } from 'express';
import dotenv from 'dotenv';

/* ------- middlewares imports ------ */
import { errorMiddleware } from './middlewares/error-middleware';

/* --------- routes imports --------- */
import adminProfileRoutes from './routes/admin/profile-routes';
import adminAuthRoutes from './routes/admin/auth-routes';
import storeOrdersRoutes from './routes/admin/store-orders-routes';
import adminMenuRoutes from './routes/admin/menu-routes';
import adminCustomerRoutes from './routes/admin/customer-routes';
import adminCategoryRoutes from './routes/admin/category-routes';
import onlineOrdersRoutes from './routes/online-orders-routes';
import categoryRoutes from './routes/category-routes';
import menuRoutes from './routes/menu-routes';

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
app.use('/api/v1/admin/store-orders', storeOrdersRoutes);
app.use('/api/v1/admin/menu', adminMenuRoutes);
app.use('/api/v1/admin/customers', adminCustomerRoutes);
app.use('/api/v1/admin/categories', adminCategoryRoutes);

// public routes
app.use('/api/v1/online-orders', onlineOrdersRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/menu', menuRoutes);

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
