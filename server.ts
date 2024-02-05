import express, { Express } from 'express';
import dotenv from 'dotenv';

// middlewares
import { errorMiddleware } from './middlewares/error-middleware';

// routes
import adminRoutes from './routes/admin-routes';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

// routes
app.use('/api/v1/admin', adminRoutes);

// handle 404 errors
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Not found ',
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});

// error middleware
app.use(errorMiddleware);

app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
