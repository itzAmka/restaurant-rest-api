import { Router } from 'express';

const adminProfileRoutes = Router();

/* --------- ADMINS INFO -------- */

/**
 * @path /api/v1/admin/profile
 * @method GET
 * @description Get all admins
 * @access Private
 */
adminProfileRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all admins' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method GET
 * @description Get admin by id
 * @access Private
 */
adminProfileRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get admin by id' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method PATCH
 * @description Update admin by id
 * @access Private
 */
adminProfileRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update admin by id' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method DELETE
 * @description Delete admin by id
 * @access Private
 */
adminProfileRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete admin by id' });
});

export default adminProfileRoutes;
