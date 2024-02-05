import { Router } from 'express';

const adminOrderItemRoutes = Router();

/* -------- ADMIN ORDER ITEMS ------- */

/**
 * @path /api/v1/admin/order-items
 * @method GET
 * @description Get all order items
 * @access Private
 */
adminOrderItemRoutes.get('/order-items', (req, res) => {
	res.json({ message: 'Get all order items' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method GET
 * @description Get order item by id
 * @access Private
 */
adminOrderItemRoutes.get('/order-items/:id', (req, res) => {
	res.json({ message: 'Get order item by id' });
});

/**
 * @path /api/v1/admin/order-items
 * @method POST
 * @description Create a new order item
 * @access Private
 */
adminOrderItemRoutes.post('/order-items', (req, res) => {
	res.json({ message: 'Create a new order item' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method PATCH
 * @description Update order item by id
 * @access Private
 */
adminOrderItemRoutes.put('/order-items/:id', (req, res) => {
	res.json({ message: 'Update order item by id' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method DELETE
 * @description Delete order item by id
 * @access Private
 */
adminOrderItemRoutes.delete('/order-items/:id', (req, res) => {
	res.json({ message: 'Delete order item by id' });
});

export default adminOrderItemRoutes;
