import asyncHandler from 'express-async-handler';

import {
	createCustomerService,
	getAllCustomersService,
	getCustomerByIdService,
	updateCustomerService,
	deleteCustomerService,
} from '../services/admin/customer-services';
import ServerError from '../utils/server-error';
import { MAX_LIMIT, DEFAULT_LIMIT } from '../utils/pagination';

// Create customer controller
export const createCustomerController = asyncHandler(async (req, res) => {
	const { email, name, phone } = req.body;

	if (!email || !name || !phone) {
		throw new ServerError(
			400,
			`Please fill in all fields: \`email\`, \`name\`, \`phone\``,
		);
	}

	const newCustomer = await createCustomerService({
		email,
		name,
		phone,
	});

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				newCustomer,
			},
		},
	});
});

// Get all customers controller
export const getAllCustomersController = asyncHandler(async (req, res) => {
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

	const results = await getAllCustomersService(searchTerm, {
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
				customers: results.customers,
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

// Get customer by id controller
export const getCustomerByIdController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const customer = await getCustomerByIdService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				customer,
			},
		},
	});
});

// Update customer by id controller
export const updateCustomerController = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, phone } = req.body;

	const updatedCustomer = await updateCustomerService(id, {
		name,
		phone,
	});

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				updatedCustomer,
			},
		},
	});
});

// Delete customer by id controller
export const deleteCustomerController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deletedCustomer = await deleteCustomerService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				deletedCustomer,
			},
		},
	});
});
