import { z } from 'zod';

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

// Create a new online order service
export const createOnlineOrderService = async (data: TOnlineOrdersSchema) => {
	try {
		const { customerId, orderItems } = onlineOrdersSchema.parse(data);

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
				totalPrice,
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
		console.log(err);

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};
