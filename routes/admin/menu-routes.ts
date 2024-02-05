import { Router } from 'express';

const adminMenuRoutes = Router();

/* -------- ADMIN MENU ITEMS -------- */

/**
 * @path /api/v1/admin/menu
 * @method GET
 * @description Get all menu items
 * @access Private
 */
adminMenuRoutes.get('/menu', (req, res) => {
	res.json({ message: 'Get all menu items' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method GET
 * @description Get menu item by id
 * @access Private
 */
adminMenuRoutes.get('/menu/:id', (req, res) => {
	res.json({ message: 'Get menu item by id' });
});

/**
 * @path /api/v1/admin/menu
 * @method POST
 * @description Create a new menu item
 * @access Private
 */
adminMenuRoutes.post('/menu', (req, res) => {
	res.json({ message: 'Create a new menu item' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method PATCH
 * @description Update menu item by id
 * @access Private
 */
adminMenuRoutes.put('/menu/:id', (req, res) => {
	res.json({ message: 'Update menu item by id' });
});

/**
 * @path /api/v1/admin/menu/:id
 * @method DELETE
 * @description Delete menu item by id
 * @access Private
 */
adminMenuRoutes.delete('/menu/:id', (req, res) => {
	res.json({ message: 'Delete menu item by id' });
});

export default adminMenuRoutes;