import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

// Get all menu items
export const getAllMenuService = async (
	searchTerm: string = '',
	pagination: TPagination,
) => {
	try {
		const { limit, skip } = pagination;

		const menu = await prisma.menu.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
			take: limit,
			skip,
			include: {
				category: true,
			},
		});

		const totalCount = await prisma.menu.count({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						description: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
		});

		return {
			menu,
			totalCount,
		};
	} catch (err: unknown) {
		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Get menu by id
export const getMenuByIdService = async (id: string) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		const menu = await prisma.menu.findUnique({
			where: {
				id,
			},
			include: {
				category: true,
			},
		});

		if (!menu) {
			throw new ServerError(404, 'Menu not found');
		}

		return menu;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Menu with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again');
	}
};

// Update menu by id
export const updateMenuService = async (id: string, data: TMenu) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		console.log(data.name);

		if (data.name) {
			// check if menu already exists,
			// handle case sensitivity
			// make sure existing menu id is not the same as the provided id for updating current menu
			const menuExists = await prisma.menu.findFirst({
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

			console.log(menuExists);

			if (menuExists) {
				throw new ServerError(400, 'Menu `name` already exists');
			}
		}

		const updatedMenu = await prisma.menu.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});

		return updatedMenu;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Menu with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(400, `Menu with id: ${id} does not exist`);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

// Delete menu by id
export const deleteMenuService = async (id: string) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		const deletedMenu = await prisma.menu.delete({
			where: {
				id,
			},
		});

		return deletedMenu;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Menu with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(
				400,
				`Menu with id: ${id} does not exist or has been deleted`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, `Something went wrong, please try again later`);
	}
};
