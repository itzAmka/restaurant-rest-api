import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';

export type TPagination = {
	limit: number;
	skip: number;
};

// Get all admins
export const getAllAdminsServices = async (
	searchTerm: string = '',
	pagination: TPagination,
) => {
	const { limit, skip } = pagination;

	try {
		const admins = await prisma.admin.findMany({
			where: {
				OR: [
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
			take: limit,
			skip,
		});

		const totalCount = await prisma.admin.count({
			where: {
				OR: [
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
		});

		return {
			admins,
			totalCount,
		};
	} catch (err) {
		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};
