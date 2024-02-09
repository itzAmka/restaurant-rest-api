import { z } from 'zod';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import {
	customerSchema,
	type TCustomer,
} from '../../utils/schema/admin/customer-schema';

export type TPagination = {
	limit: number;
	skip: number;
};

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

// Get all customers
export const getAllCustomersService = async (
	searchTerm: string = '',
	pagination: TPagination,
) => {
	try {
		const { limit, skip } = pagination;

		const customers = await prisma.customer.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						phone: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
			take: limit,
			skip,
			include: {
				// order: true
			},
		});

		const totalCount = await prisma.customer.count({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						phone: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
		});

		return {
			customers,
			totalCount,
		};
	} catch (err: unknown) {
		throw new ServerError(500, 'Something went wrong, please try again');
	}
};
