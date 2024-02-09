import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
				order: true,
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

// Get customer by id
export const getCustomerByIdService = async (id: string) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		const customer = await prisma.customer.findUnique({
			where: {
				id,
			},
			include: {
				order: true,
			},
		});

		if (!customer) {
			throw new ServerError(404, 'Customer not found');
		}

		return customer;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Customer with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Update customer by id
export const updateCustomerService = async (
	id: string,
	data: Omit<TCustomer, 'email'>,
) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	let phone: string | undefined;
	let name: string | undefined;

	try {
		if (data.phone) {
			phone = customerSchema
				.omit({ email: true, name: true })
				.parse(data).phone;
		}

		if (data.name) {
			name = customerSchema.omit({ email: true, phone: true }).parse(data).name;
		}

		if (data.name) {
			// check if customer already exists,
			// handle case sensitivity
			// make sure existing customer id is not the same as the provided id for updating current customer
			const customerExists = await prisma.customer.findFirst({
				where: {
					name: {
						mode: 'insensitive',
						equals: data.name,
					},
					id: {
						not: id,
					},
				},
			});

			if (customerExists) {
				throw new ServerError(400, 'Customer `name` already exists');
			}
		}

		const updatedCustomer = await prisma.customer.update({
			where: {
				id,
			},
			data: {
				phone,
				name,
			},
		});

		return updatedCustomer;
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			throw new ServerError(
				400,
				err.errors[0].message ?? 'Invalid data provided',
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Customer with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(400, `Customer with id: ${id} does not exist`);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

// Delete customer by id
export const deleteCustomerService = async (id: string) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		const deletedCustomer = await prisma.customer.delete({
			where: {
				id,
			},
		});

		return deletedCustomer;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Customer with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(
				400,
				`Customer with id: ${id} does not exist or has been deleted`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, `Something went wrong, please try again later`);
	}
};
