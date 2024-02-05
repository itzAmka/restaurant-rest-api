import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
