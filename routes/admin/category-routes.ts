import { Router } from 'express';

const adminCategoryRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/category
 * @method GET
 * @description Get all categories
 * @access Private
 */
adminCategoryRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all categories' });
});

/**
 * @path /api/v1/admin/category/:id
 * @method GET
 * @description Get category by id
 * @access Private
 */
adminCategoryRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get category by id' });
});

/**
 * @path /api/v1/admin/category
 * @method POST
 * @description Create category
 * @access Private
 */
adminCategoryRoutes.post('/', (req, res) => {
	res.json({ message: 'Create category' });
});

/**
 * @path /api/v1/admin/category/:id
 * @method PATCH
 * @description Update category by id
 * @access Private
 */
adminCategoryRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update category by id' });
});

/**
 * @path /api/v1/admin/category/:id
 * @method DELETE
 * @description Delete category by id
 * @access Private
 */
adminCategoryRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete category by id' });
});

export default adminCategoryRoutes;
