import { Router } from 'express';

const admingRoutes = Router();

/* -------- ADMIN ORDER ITEMS ------- */

/**
 * @path /api/v1/admin/order-items
 * @method GET
 * @description Get all order items
 * @access Private
 */
admingRoutes.get('/order-items', (req, res) => {
	res.json({ message: 'Get all order items' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method GET
 * @description Get order item by id
 * @access Private
 */
admingRoutes.get('/order-items/:id', (req, res) => {
	res.json({ message: 'Get order item by id' });
});

/**
 * @path /api/v1/admin/order-items
 * @method POST
 * @description Create a new order item
 * @access Private
 */
admingRoutes.post('/order-items', (req, res) => {
	res.json({ message: 'Create a new order item' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method PATCH
 * @description Update order item by id
 * @access Private
 */
admingRoutes.put('/order-items/:id', (req, res) => {
	res.json({ message: 'Update order item by id' });
});

/**
 * @path /api/v1/admin/order-items/:id
 * @method DELETE
 * @description Delete order item by id
 * @access Private
 */
admingRoutes.delete('/order-items/:id', (req, res) => {
	res.json({ message: 'Delete order item by id' });
});

/* -------- ADMIN CUSTOMERS -------- */

/**
 * @path /api/v1/admin/customers
 * @method GET
 * @description Get all customers
 * @access Private
 */
admingRoutes.get('/customers', (req, res) => {
	res.json({ message: 'Get all customers' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method GET
 * @description Get customer by id
 * @access Private
 */
admingRoutes.get('/customers/:id', (req, res) => {
	res.json({ message: 'Get customer by id' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method PATCH
 * @description Update customer by id
 * @access Private
 */
admingRoutes.put('/customers/:id', (req, res) => {
	res.json({ message: 'Update customer by id' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method DELETE
 * @description Delete customer by id
 * @access Private
 */
admingRoutes.delete('/customers/:id', (req, res) => {
	res.json({ message: 'Delete customer by id' });
});

export default admingRoutes;
