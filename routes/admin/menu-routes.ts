import { Router } from 'express';

import {
	createMenuController,
	getAllMenuController,
	getMenuByIdController,
	updateMenuController,
	deleteMenuByIdController,
} from '../../controllers/menu-controllers';

const adminMenuRoutes = Router();

/* -------- ADMIN MENU ITEMS -------- */

/**
 * @path /api/v1/admin/menu
 * @method GET
 * @description Get all menu items
 * @access Private
 */
adminMenuRoutes.get('/', getAllMenuController);

/**
 * @path /api/v1/admin/menu
 * @method POST
 * @description Create a new menu item
 * @access Private
 */
adminMenuRoutes.post('/', createMenuController);

/**
 * @path /api/v1/admin/menu/:id
 * @method GET
 * @description Get menu item by id
 * @access Private
 */
adminMenuRoutes.get('/:id', getMenuByIdController);

/**
 * @path /api/v1/admin/menu/:id
 * @method PATCH
 * @description Update menu item by id
 * @access Private
 */
adminMenuRoutes.patch('/:id', updateMenuController);

/**
 * @path /api/v1/admin/menu/:id
 * @method DELETE
 * @description Delete menu item by id
 * @access Private
 */
adminMenuRoutes.delete('/:id', deleteMenuByIdController);

export default adminMenuRoutes;
