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
