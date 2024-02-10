import { Router } from 'express';

import {
	getAllMenuController,
	getMenuByIdController,
} from '../controllers/menu-controllers';

const menuRoutes = Router();

/* -------- ADMIN MENU ITEMS -------- */

/**
 * @path /api/v1/menu
 * @method GET
 * @description Get all menu items
 * @access Private
 */
menuRoutes.get('/', getAllMenuController);

/**
 * @path /api/v1/menu/:id
 * @method GET
 * @description Get menu item by id
 * @access Private
 */
menuRoutes.get('/:id', getMenuByIdController);

export default menuRoutes;
