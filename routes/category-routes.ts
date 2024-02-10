import { Router } from 'express';

import {
	getCategoriesController,
	getCategoryByIdController,
} from '../controllers/category-controllers';

const categoryRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/categories
 * @method GET
 * @description Get all categories
 * @access Private
 */
categoryRoutes.get('/', getCategoriesController);

/**
 * @path /api/v1/admin/categories/:id
 * @method GET
 * @description Get category by id
 * @access Private
 */
categoryRoutes.get('/:id', getCategoryByIdController);

export default categoryRoutes;
