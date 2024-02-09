import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { createCategoryService } from '../services/admin/category-services';
import ServerError from '../utils/server-error';

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
				category,
			},
		});
	},
);
