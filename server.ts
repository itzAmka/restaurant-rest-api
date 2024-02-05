import express, { Express } from 'express';
import dotenv from 'dotenv';

/* ------- middlewares imports ------ */
import { errorMiddleware } from './middlewares/error-middleware';

/* --------- routes imports --------- */
import adminRoutes from './routes/admin-routes';
import adminAuthRoutes from './routes/admin/auth-routes';

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

// admin auth routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);

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
