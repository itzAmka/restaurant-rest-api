import { z } from 'zod';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import { menuSchema, type TMenu } from '../../utils/schema/admin/menu-schema';

export type TPagination = {
	limit: number;
	skip: number;
};

// Create menu
export const createMenuService = async (data: TMenu) => {
	try {
		const menu = menuSchema.parse(data);

		// check if menu already exists,
		// handle case sensitivity
		const menuExists = await prisma.menu.findFirst({
			where: {
				name: {
					mode: 'insensitive',
					equals: menu.name,
				},
			},
		});

		if (menuExists) {
			throw new ServerError(400, 'Menu already exists');
		}

		const newMenu = await prisma.menu.create({
			data: {
				...menu,
			},
		});

		return newMenu;
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
