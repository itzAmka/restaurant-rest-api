import { z } from 'zod';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import {
	categorySchema,
	type TCategoryData,
} from '../../utils/schema/admin/category-schema';

export type TPagination = {
	limit: number;
	skip: number;
};

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

// Get category
export const createCategoryService = async (data: TCategoryData) => {
	try {
		const category = categorySchema.parse(data);

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

		throw new ServerError(400, 'Invalid data provided');
	}
};
