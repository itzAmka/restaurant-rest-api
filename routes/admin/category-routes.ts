import { Router } from 'express';

import {
	getCategoriesController,
	createCategoryController,
	getCategoryByIdController,
	getAllCategoriesIdsController,
	updateCategoryByIdController,
	deleteCategoryByIdController,
} from '../../controllers/category-controllers';

const adminCategoryRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/categories
 * @method GET
 * @description Get all categories
 * @access Private
 */
adminCategoryRoutes.get('/', getCategoriesController);

/**
 * @path /api/v1/admin/categories/:id
 * @method GET
 * @description Get category by id
 * @access Private
 */
adminCategoryRoutes.get('/:id', getCategoryByIdController);

/**
 * @path /api/v1/admin/categories/all/ids
 * @method GET
 * @description Get all categories ids
 * @access Private
 */
adminCategoryRoutes.get('/all/ids', getAllCategoriesIdsController);

/**
 * @path /api/v1/admin/categories
 * @method POST
 * @description Create category
 * @access Private
 */
adminCategoryRoutes.post('/', createCategoryController);

/**
 * @path /api/v1/admin/categories/:id
 * @method PATCH
 * @description Update category by id
 * @access Private
 */
adminCategoryRoutes.patch('/:id', updateCategoryByIdController);

/**
 * @path /api/v1/admin/categories/:id
 * @method DELETE
 * @description Delete category by id
 * @access Private
 */
adminCategoryRoutes.delete('/:id', deleteCategoryByIdController);

export default adminCategoryRoutes;
