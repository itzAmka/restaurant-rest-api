import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../config/prisma';
import ServerError from '../../utils/server-error';
import { TPagination } from './store-orders-services';

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

// Get admin by id
export const getAdminByIdServices = async (id: string) => {
	if (!id) throw new ServerError(400, 'Invalid id');

	try {
		const admin = await prisma.admin.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!admin) {
			throw new ServerError(404, 'Admin not found');
		}

		return admin;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find admin with the provided id or invalid id: ${id}`,
			);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

type TUpdateAdminById = {
	role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';
};

// Update admin by id
export const updateAdminByIdServices = async (
	id: string,
	data: TUpdateAdminById,
) => {
	if (!id) throw new ServerError(400, 'Invalid id');

	try {
		// find admin by id
		const existingAdmin = await prisma.admin.findUnique({
			where: {
				id,
			},
			select: {
				role: true,
			},
		});

		const admin = await prisma.admin.update({
			where: {
				id,
			},
			data: {
				role: data.role ?? existingAdmin?.role,
			},
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return admin;
	} catch (err) {
		console.log(err);

		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find admin with the provided id or invalid id: ${id}`,
			);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};

// Delete admin by id
export const deleteAdminByIdServices = async (id: string) => {
	if (!id) throw new ServerError(400, 'Invalid id');

	try {
		const admin = await prisma.admin.delete({
			where: {
				id,
			},
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return admin;
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === 'P2023') {
			throw new ServerError(
				404,
				`Cannot find admin with the provided id or invalid id: ${id}`,
			);
		}

		throw new ServerError(500, 'Something went wrong, please try again later');
	}
};
