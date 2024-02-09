import asyncHandler from 'express-async-handler';

import {
	createMenuService,
	getAllMenuService,
	getMenuByIdService,
	updateMenuService,
	deleteMenuService,
} from '../services/admin/menu-services';
import ServerError from '../utils/server-error';

// Create menu controller
export const createMenuController = asyncHandler(async (req, res) => {
	const { name, price, description, categoryId } = req.body;

	// Validate data
	if (
		!name ||
		!price ||
		description === undefined ||
		description === null ||
		!categoryId
	) {
		throw new ServerError(
			400,
			`All fields are required: \`name\`, \`price\`, \`description\`, \`categoryId\``,
		);
	}

	const newMenu = await createMenuService({
		name,
		price,
		description,
		categoryId,
	});

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				newMenu,
			},
		},
	});
});

// Get all menu controller
export const getAllMenuController = asyncHandler(async (req, res) => {
	const { searchTerm } = req.query as { searchTerm: string };

	// pagination
	const page = parseInt((req.query.page as string) ?? 1);
	const limit = parseInt((req.query.limit as string) ?? 10);
	const skip = (page - 1) * limit;

	const results = await getAllMenuService(searchTerm, {
		limit,
		skip,
	});

	const totalPages = Math.ceil(results.totalCount / limit);
	const nextPage = page < totalPages ? page + 1 : null;
	const prevPage = page > 1 ? page - 1 : null;

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				menu: results.menu,
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
