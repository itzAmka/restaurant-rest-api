import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../config/prisma';
import ServerError from '../utils/server-error';
import {
	onlineOrdersSchema,
	type TOnlineOrdersSchema,
} from '../utils/schema/online-orders-schema';

export type TPagination = {
	limit: number;
	skip: number;
};

export type TUpdateOnlineOrderStatus = {
	orderStatus:
		| 'PROCESSING'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'READY_FOR_PICKUP'
		| 'PICKED_UP';
	paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
};

// Create a new online order service
export const createOnlineOrderService = async (data: TOnlineOrdersSchema) => {
	try {
		const { customerId } = onlineOrdersSchema.parse(data);

		let orderItems = data.orderItems;

		// if there are duplicate menuIds, combine them into one and sum the quantity
		orderItems = orderItems.reduce(
			(acc, item) => {
				const existingItem = acc.find((i) => i.menuId === item.menuId);

				if (existingItem) {
					existingItem.quantity += item.quantity;
					return acc;
				}

				return [...acc, item];
			},
			[] as TOnlineOrdersSchema['orderItems'],
		);

		const menuIds = orderItems.map((item) => item.menuId);

		const menus = await prisma.menu.findMany({
			where: {
				id: {
					in: menuIds,
				},
			},
		});

		if (menus.length === 0) {
			throw new ServerError(404, 'Menu not found');
		}

		const totalPrice = menus.reduce((acc, menu) => {
			const orderItem = orderItems.find((item) => item.menuId === menu.id);

			if (!orderItem || !orderItem.quantity) {
				throw new ServerError(400, 'Please provide `quantity`');
			}

			// remove all non-numeric characters from price accept the dot("$10.00" => 10.00)
			const price = Number(menu.price.replace(/[^\d.]/g, ''));
			const quantity = orderItem.quantity;

			return acc + price * quantity;
		}, 0);

		const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

		// TODO: charge logic here

		// create new order
		const newOnlineOrder = await prisma.onlineOrders.create({
			data: {
				customerId,
				totalPrice: Number(totalPrice.toFixed(2)),
				totalItems,
				paymentStatus: 'UNPAID',
				orderStatus: 'PROCESSING',
				menuIds,
			},
			include: {
				customer: true,
			},
		});

		return newOnlineOrder;
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

// Get all online orders service
export const getAllOnlineOrdersService = async (pagination: TPagination) => {
	try {
		const { limit, skip } = pagination;

		const onlineOrders = await prisma.onlineOrders.findMany({
			take: limit,
			skip,
			include: {
				customer: true,
				// menu: true, TODO: include menu later when needed
			},
		});

		const totalCount = await prisma.onlineOrders.count();

		return {
			onlineOrders,
			totalCount,
		};
	} catch (err: unknown) {
		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Get online order by id service
export const getOnlineOrderService = async (id: string) => {
	if (!id) {
		throw new ServerError(400, 'Please provide `id`');
	}

	try {
		const onlineOrder = await prisma.onlineOrders.findUnique({
			where: {
				id,
			},
			include: {
				customer: true,
				// menu: true, TODO: include menu later when needed
			},
		});

		if (!onlineOrder) {
			throw new ServerError(404, 'Order not found');
		}

		return onlineOrder;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Order with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Update online order by id service
export const updateOnlineOrderService = async (
	id: string,
	data: Pick<TOnlineOrdersSchema, 'orderItems'>,
) => {
	if (!id) {
		throw new ServerError(400, 'Please provide `id`');
	}

	let orderItems: TOnlineOrdersSchema['orderItems'] = [];

	try {
		if (data.orderItems) {
			orderItems = onlineOrdersSchema
				.omit({ customerId: true })
				.parse(data).orderItems;
		}

		// if there are duplicate menuIds, combine them into one and sum the quantity
		orderItems = orderItems.reduce(
			(acc, item) => {
				const existingItem = acc.find((i) => i.menuId === item.menuId);

				if (existingItem) {
					existingItem.quantity += item.quantity;
					return acc;
				}

				return [...acc, item];
			},
			[] as TOnlineOrdersSchema['orderItems'],
		);

		// calculate total price and total items
		const menuIds = orderItems.map((item) => item.menuId);

		const menus = await prisma.menu.findMany({
			where: {
				id: {
					in: menuIds,
				},
			},
		});

		if (menus.length === 0) {
			throw new ServerError(404, 'Menu not found');
		}

		const totalPrice = menus.reduce((acc, menu) => {
			const orderItem = orderItems.find((item) => item.menuId === menu.id);

			if (!orderItem || !orderItem.quantity) {
				throw new ServerError(400, 'Please provide `quantity`');
			}

			// remove all non-numeric characters from price accept the dot("$10.00" => 10.00)
			const price = Number(menu.price.replace(/[^\d.]/g, ''));
			const quantity = orderItem.quantity;

			return acc + price * quantity;
		}, 0);

		const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

		// update order
		const updatedOnlineOrder = await prisma.onlineOrders.update({
			where: {
				id,
			},
			data: {
				menuIds: orderItems.map((item) => item.menuId),
				totalPrice: Number(totalPrice.toFixed(2)),
				totalItems,
			},
			include: {
				customer: true,
				// menu: true, TODO: include menu later when needed
			},
		});

		return { message: 'Order updated successfully', updatedOnlineOrder };
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
				`Cannot find Order with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(404, 'Order not found');
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Update online order status by id service
export const updateOnlineOrderStatusService = async (
	id: string,
	status: TUpdateOnlineOrderStatus,
) => {
	if (!id) {
		throw new ServerError(400, 'Please provide `id`');
	}

	const { orderStatus, paymentStatus } = status;

	if (
		orderStatus !== 'PROCESSING' &&
		orderStatus !== 'COMPLETED' &&
		orderStatus !== 'CANCELLED' &&
		orderStatus !== 'READY_FOR_PICKUP' &&
		orderStatus !== 'PICKED_UP'
	) {
		throw new ServerError(400, 'Invalid `orderStatus`');
	}

	if (
		paymentStatus !== 'PAID' &&
		paymentStatus !== 'UNPAID' &&
		paymentStatus !== 'REFUNDED'
	) {
		throw new ServerError(400, 'Invalid `paymentStatus`');
	}

	try {
		const updatedOnlineOrder = await prisma.onlineOrders.update({
			where: {
				id,
			},
			data: {
				orderStatus,
				paymentStatus,
			},
			include: {
				customer: true,
				// menu: true, TODO: include menu later when needed
			},
		});

		return updatedOnlineOrder;
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
				`Cannot find Order with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(404, 'Order not found');
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Delete online order by id service
export const deleteOnlineOrderService = async (id: string) => {
	if (!id) {
		throw new ServerError(400, 'Please provide `id`');
	}

	try {
		const deletedOnlineOrder = await prisma.onlineOrders.delete({
			where: {
				id,
			},
		});

		return deletedOnlineOrder;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Order with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};
