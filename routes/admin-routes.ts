import { Router } from 'express';

const admingRoutes = Router();

/* --------- ADMINS INFO -------- */

/**
 * @path /api/v1/admin/profile
 * @method GET
 * @description Get all admins
 * @access Private
 */
admingRoutes.get('/profile', (req, res) => {
	res.json({ message: 'Get all admins' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method GET
 * @description Get admin by id
 * @access Private
 */
admingRoutes.get('/profile/:id', (req, res) => {
	res.json({ message: 'Get admin by id' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method PATCH
 * @description Update admin by id
 * @access Private
 */
admingRoutes.put('/profile/:id', (req, res) => {
	res.json({ message: 'Update admin by id' });
});

/**
 * @path /api/v1/admin/profile/:id
 * @method DELETE
 * @description Delete admin by id
 * @access Private
 */
admingRoutes.delete('/profile/:id', (req, res) => {
	res.json({ message: 'Delete admin by id' });
});

/* ---------- ADMIN ORDERS ---------- */

/**
 * @path /api/v1/admin/orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
admingRoutes.get('/orders', (req, res) => {
	res.json({ message: 'Get all orders' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
admingRoutes.get('/orders/:id', (req, res) => {
	res.json({ message: 'Get order by id' });
});

/**
 * @path /api/v1/admin/orders
 * @method POST
 * @description Create a new order
 * @access Private
 */
admingRoutes.post('/orders', (req, res) => {
	res.json({ message: 'Create a new order' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method PATCH
 * @description Update order by id
 * @access Private
 */
admingRoutes.put('/orders/:id', (req, res) => {
	res.json({ message: 'Update order by id' });
});

/**
 * @path /api/v1/admin/orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
admingRoutes.delete('/orders/:id', (req, res) => {
	res.json({ message: 'Delete order by id' });
});

/* -------- ADMIN MENU ITEMS -------- */

/**
 * @path /api/v1/admin/menu
 * @method GET
 * @description Get all menu items
 * @access Private
 */
admingRoutes.get('/menu', (req, res) => {
	res.json({ message: 'Get all menu items' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method GET
 * @description Get menu item by id
 * @access Private
 */
admingRoutes.get('/menu/:id', (req, res) => {
	res.json({ message: 'Get menu item by id' });
});

/**
 * @path /api/v1/admin/menu
 * @method POST
 * @description Create a new menu item
 * @access Private
 */
admingRoutes.post('/menu', (req, res) => {
	res.json({ message: 'Create a new menu item' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method PATCH
 * @description Update menu item by id
 * @access Private
 */
admingRoutes.put('/menu/:id', (req, res) => {
	res.json({ message: 'Update menu item by id' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method DELETE
 * @description Delete menu item by id
 * @access Private
 */
admingRoutes.delete('/menu/:id', (req, res) => {
	res.json({ message: 'Delete menu item by id' });
});

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
