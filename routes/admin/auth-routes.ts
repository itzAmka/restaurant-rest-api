import { Router } from 'express';

const admingAuthRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/auth/register
 * @method POST
 * @description Create a new admin, only SUPER_ADMIN can create a new admin
 * @access Private
 */
admingAuthRoutes.post('/register', (req, res) => {
	res.json({ message: 'Create a new admin' });
});

/**
 * @path /api/v1/admin/auth/login
 * @method POST
 * @description Login admin
 * @access Private
 */
admingAuthRoutes.post('/login', (req, res) => {
	res.json({ message: 'Login admin' });
});

export default admingAuthRoutes;
