import { Router } from 'express';

const storeOrdersRoutes = Router();

/* ---------- ADMIN ORDERS ---------- */

/**
 * @path /api/v1/admin/store-orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
storeOrdersRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all store orders' });
});

/**
 * @path /api/v1/admin/store-orders
 * @method POST
 * @description Create a new order
 * @access Private
 */
storeOrdersRoutes.post('/', (req, res) => {
	res.json({ message: 'Create a new store order' });
});

/**
 * @path /api/v1/admin/store-orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
storeOrdersRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get store order by id' });
});

/**
 * @path /api/v1/admin/store-orders/:id
 * @method PATCH
 * @description Update order by id
 * @access Private
 */
storeOrdersRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update store order by id' });
});

/**
 * @path /api/v1/admin/store-orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
storeOrdersRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete store order by id' });
});

export default storeOrdersRoutes;
