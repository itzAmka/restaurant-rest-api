import asyncHandler from 'express-async-handler';

import {
	createOnlineOrderService,
	getAllOnlineOrdersService,
	getOnlineOrderService,
	updateOnlineOrderService,
	updateOnlineOrderStatusService,
	deleteOnlineOrderService,
} from '../services/online-orders-services';
import ServerError from '../utils/server-error';

// Create a new online order controller
export const createOnlineOrderController = asyncHandler(async (req, res) => {
	const { customerId, orderItems } = req.body;

	if (!customerId) {
		throw new ServerError(400, 'Please provide `customerId`');
	}

	if (!orderItems) {
		throw new ServerError(400, 'Please provide `orderItems`');
	}

	if (orderItems.length === 0) {
		throw new ServerError(
			400,
			'`orderItems` must be an array with at least one item',
		);
	}

	const newOnlineOrder = await createOnlineOrderService({
		customerId,
		orderItems,
	});

	res.status(201).json({
		success: true,
		error: null,
		results: {
			data: {
				newOnlineOrder,
			},
		},
	});
});

// Get all online orders controller
export const getAllOnlineOrdersController = asyncHandler(async (req, res) => {
	// pagination
	const page = parseInt((req.query.page as string) ?? 1);
	const limit = parseInt((req.query.limit as string) ?? 10);
	const skip = (page - 1) * limit;

	const results = await getAllOnlineOrdersService({
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
				onlineOrders: results.onlineOrders,
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

// Get online order by id controller
export const getOnlineOrderController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const onlineOrder = await getOnlineOrderService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				onlineOrder,
			},
		},
	});
});

// Update online order by id controller
export const updateOnlineOrderController = asyncHandler(async (req, res) => {
	const { id } = req.params;
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

	const updatedOnlineOrder = await updateOnlineOrderService(id, {
		orderItems,
	});

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				updatedOnlineOrder,
			},
		},
	});
});

// Update online order status by id service
export const updateOnlineOrderStatusController = asyncHandler(
	async (req, res) => {
		const { id } = req.params;
		const { status } = req.body;

		if (!status) {
			throw new ServerError(400, 'Please provide `status`');
		}

		const updatedOnlineOrderStatus = await updateOnlineOrderStatusService(
			id,
			status,
		);

		res.status(200).json({
			success: true,
			error: null,
			results: {
				data: {
					updatedOnlineOrderStatus,
				},
			},
		});
	},
);

// Delete online order by id controller
export const deleteOnlineOrderController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deletedOnlineOrder = await deleteOnlineOrderService(id);

	res.status(200).json({
		success: true,
		error: null,
		results: {
			data: {
				deletedOnlineOrder,
			},
		},
	});
});
