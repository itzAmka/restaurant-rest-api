import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import {
	storeOrdersSchema,
	type TStoreOrdersSchema,
} from '../../utils/schema/admin/store-orders-schema';

export type TPagination = {
	limit: number;
	skip: number;
};

export type TUpdateStoreOrderStatus = {
	orderStatus:
		| 'PROCESSING'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'READY_FOR_PICKUP'
		| 'PICKED_UP';
	paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
};

// Create a new store order service
export const createStoreOrderService = async (data: TStoreOrdersSchema) => {
	try {
		const parsedData = storeOrdersSchema.parse(data);

		let orderItems = parsedData.orderItems;

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
			[] as TStoreOrdersSchema['orderItems'],
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

		// generate order number: 8-digit random number
		const orderNumber = Math.floor(10000000 + Math.random() * 90000000);

		// create new order
		const newStoreOrder = await prisma.storeOrders.create({
			data: {
				orderNumber,
				totalPrice: Number(totalPrice.toFixed(2)),
				totalItems,
				paymentStatus: 'UNPAID',
				orderStatus: 'PROCESSING',
				menuIds,
			},
			include: {
				// menu: true, TODO: include menu later when needed
			},
		});

		return newStoreOrder;
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

// Get all store orders service
export const getAllStoreOrdersService = async (pagination: TPagination) => {
	try {
		const { limit, skip } = pagination;

		const storeOrders = await prisma.storeOrders.findMany({
			take: limit,
			skip,
			include: {
				// menu: true, TODO: include menu later when needed
			},
		});

		const totalCount = await prisma.storeOrders.count();

		return {
			storeOrders,
			totalCount,
		};
	} catch (err: unknown) {
		throw new ServerError(500, 'Something went wrong, please try again');
	}
};
