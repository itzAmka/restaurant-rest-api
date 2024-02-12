import asyncHandler from 'express-async-handler';

import {
	createStoreOrderService,
	getAllStoreOrdersService,
	getStoreOrderService,
	getStoreOrderByOrderNumberService,
	updateStoreOrderService,
	updateStoreOrderStatusService,
	deleteStoreOrderService,
} from '../services/admin/store-orders-services';
import ServerError from '../utils/server-error';

// Create a new store order controller
export const createStoreOrderController = asyncHandler(async (req, res) => {
	const { orderItems } = req.body;

	if (!orderItems) {
		throw new ServerError(400, 'Please provide `orderItems`');
	}

	if (orderItems.length === 0) {
		throw new ServerError(
			400,
			'`orderItems` must be an array with at least one item',
		);
	}

	const newStoreOrder = await createStoreOrderService({
		orderItems,
	});

	res.status(201).json({
		success: true,
		error: null,
		results: {
			data: {
				newStoreOrder,
			},
		},
	});
});

// Get all store orders controller
export const getAllStoreOrdersController = asyncHandler(async (req, res) => {
	// pagination
	const page = parseInt((req.query.page as string) ?? 1);
	const limit = parseInt((req.query.limit as string) ?? 10);
	const skip = (page - 1) * limit;

	const results = await getAllStoreOrdersService({
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
				storeOrders: results.storeOrders,
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

// Get store order by id controller
export const getStoreOrderController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const storeOrder = await getStoreOrderService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				storeOrder,
			},
		},
	});
});
