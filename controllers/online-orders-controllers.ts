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
