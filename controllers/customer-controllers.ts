import asyncHandler from 'express-async-handler';

import {
	createCustomerService,
	getAllCustomersService,
	getCustomerByIdService,
	updateCustomerService,
	deleteCustomerService,
} from '../services/admin/customer-services';
import ServerError from '../utils/server-error';

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
