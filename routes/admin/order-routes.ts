import { Router } from 'express';

const adminOrderRoutes = Router();

/* ---------- ADMIN ORDERS ---------- */

/**
 * @path /api/v1/admin/orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
adminOrderRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all orders' });
});

/**
 * @path /api/v1/admin/orders
 * @method POST
 * @description Create a new order
 * @access Private
 */
adminOrderRoutes.post('/', (req, res) => {
	res.json({ message: 'Create a new order' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
adminOrderRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get order by id' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method PATCH
 * @description Update order by id
 * @access Private
 */
adminOrderRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update order by id' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
adminOrderRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete order by id' });
});

export default adminOrderRoutes;
