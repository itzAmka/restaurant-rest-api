import { z } from 'zod';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import {
	customerSchema,
	type TCustomer,
} from '../../utils/schema/admin/customer-schema';

// Create customer
export const createCustomerService = async (data: TCustomer) => {
	try {
		const customer = customerSchema.parse(data);

		// check if customer already exists,
		// handle case sensitivity
		const customerExists = await prisma.customer.findFirst({
			where: {
				email: {
					mode: 'insensitive',
					equals: customer.email,
				},
			},
		});

		if (customerExists) {
			throw new ServerError(400, 'Customer already exists');
		}

		const newCustomer = await prisma.customer.create({
			data: {
				...customer,
			},
		});

		return newCustomer;
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			throw new ServerError(
				400,
				err.errors[0].message ?? 'Invalid data provided',
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};
