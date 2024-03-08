import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import {
	createCategoryService,
	getCategoriesService,
	getCategoryByIdService,
	getAllCategoriesIdsService,
	updateCategoryService,
	deleteCategoryService,
} from '../services/admin/category-services';
import ServerError from '../utils/server-error';
import { MAX_LIMIT, DEFAULT_LIMIT } from '../utils/pagination';

// Create category controller
export const createCategoryController = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, description } = req.body;

		if (!name || !description) {
			throw new ServerError(400, 'Please provide `name` and `description`');
		}

		const category = await createCategoryService({ name, description });

		res.status(200).json({
			success: true,
			error: null,
			results: {
				data: {
					category,
				},
			},
		});
	},
);

// Get categories controller
export const getCategoriesController = asyncHandler(async (req, res) => {
	const { searchTerm } = req.query as { searchTerm: string };

	// pagination
	const page = parseInt((req.query.page as string) ?? 1);
	const limit = parseInt((req.query.limit as string) ?? DEFAULT_LIMIT);
	const skip = (page - 1) * limit;

	// handle invalid page and limit
	if (page < 1 || limit < 1) {
		throw new ServerError(400, 'Invalid `page` or `limit` value');
	}

	// limit cannot be greater than MAX_LIMIT
	if (limit > MAX_LIMIT) {
		throw new ServerError(400, 'value `limit` cannot be greater than 50');
	}

	const results = await getCategoriesService(searchTerm, { limit, skip });

	const totalPages = Math.ceil(results.totalCount / limit);
	const nextPage = page < totalPages ? page + 1 : null;
	const prevPage = page > 1 ? page - 1 : null;

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				categories: results.categories,
			},
			pagination: {
				limit,
				page,
				totalPages,
				prevPage,
				nextPage,
				totalCount: results.totalCount,
			},
		},
	});
});

// Get category by id controller
export const getCategoryByIdController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const category = await getCategoryByIdService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				category,
			},
		},
	});
});

export const getAllCategoriesIdsController = asyncHandler(async (req, res) => {
	const categoriesIds = await getAllCategoriesIdsService();

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				categoriesIds,
			},
		},
	});
});

// Update category by id controller
export const updateCategoryByIdController = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;

	const updateCategory = await updateCategoryService(id, { name, description });

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				updateCategory,
			},
		},
	});
});

// Delete category by id controller
export const deleteCategoryByIdController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deletedCategory = await deleteCategoryService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				deletedCategory,
			},
		},
	});
});
