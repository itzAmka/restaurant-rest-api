import { Router } from 'express';

const onlineOrdersRoutes = Router();

/* ---------- ADMIN ORDERS ---------- */

/**
 * @path /api/v1/online-orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
onlineOrdersRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all online orders' });
});

/**
 * @path /api/v1/online-orders
 * @method POST
 * @description Create a new order
 * @access Private
 */
onlineOrdersRoutes.post('/', (req, res) => {
	res.json({ message: 'Create a new online order' });
});

/**
 * @path /api/v1/online-orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
onlineOrdersRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get online order by id' });
});

/**
 * @path /api/v1/online-orders/:id
 * @method PATCH
 * @description Update order by id
 * @access Private
 */
onlineOrdersRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update online order by id' });
});

/**
 * @path /api/v1/online-orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
onlineOrdersRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete online order by id' });
});

export default onlineOrdersRoutes;
