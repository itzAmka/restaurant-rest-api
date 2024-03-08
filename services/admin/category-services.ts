import { z } from 'zod';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import {
	categorySchema,
	type TCategoryData,
} from '../../utils/schema/admin/category-schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TPagination } from './profile-services';

// Get all categories
export const getCategoriesService = async (
	searchTerm: string = '',
	pagination: TPagination,
) => {
	const { limit, skip } = pagination;

	const categories = await prisma.category.findMany({
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
			menu: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const totalCount = await prisma.category.count({
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
		categories,
		totalCount,
	};
};

// Get category by id
export const getCategoryByIdService = async (id: string) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				id,
			},
			include: {
				menu: true,
			},
		});

		if (!category) {
			throw new ServerError(404, 'Category not found');
		}

		return category;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Category with the provided id or invalid id: ${id}`,
			);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

// Get all categories ids
export const getAllCategoriesIdsService = async () => {
	const categories = await prisma.category.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return categories;
};

// Create category
export const createCategoryService = async (data: TCategoryData) => {
	try {
		const category = categorySchema.parse(data);

		// check if category already exists, and handle case sensitivity
		const categoryExists = await prisma.category.findFirst({
			where: {
				name: {
					mode: 'insensitive',
					equals: category.name,
				},
			},
		});

		if (categoryExists) {
			throw new ServerError(400, 'Category already exists');
		}

		const newCategory = await prisma.category.create({
			data: {
				...category,
			},
		});

		return newCategory;
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

		throw new ServerError(400, 'Invalid data provided');
	}
};

// Update category
export const updateCategoryService = async (
	id: string,
	data: TCategoryData,
) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		if (data.name) {
			// check if category already exists,
			// handle case sensitivity
			// make sure existing category id is not the same as the provided id for updating current category
			const categoryExists = await prisma.category.findFirst({
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

			if (categoryExists) {
				throw new ServerError(400, 'Category `name` already exists');
			}
		}

		const updatedCategory = await prisma.category.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});

		return updatedCategory;
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Category with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(
				400,
				`Category with id: ${id} does not exist or has been updated`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

// Delete category
export const deleteCategoryService = async (id: string) => {
	if (!id) throw new ServerError(400, 'please provide a valid id');

	try {
		const deletedCategory = await prisma.category.delete({
			where: {
				id,
			},
		});

		return deletedCategory;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find Category with the provided id or invalid id: ${id}`,
			);
		}

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
			throw new ServerError(
				400,
				`Category with id: ${id} does not exist or has been deleted`,
			);
		}

		if (err instanceof ServerError) {
			throw new ServerError(err.status, err.message);
		}

		throw new ServerError(500, `Something went wrong, please try again later`);
	}
};
