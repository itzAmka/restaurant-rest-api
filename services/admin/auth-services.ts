import { z } from 'zod';

import { prisma } from '../../config/prisma';
import {
	adminRegisterDataSchema,
	type TAdminRegisterationData,
} from '../../utils/schema/admin/auth-schema';
import { hashPassword } from '../../utils/hashing/hashPassword';

const validateAdminRegisterationData = (
	adminRegisterationData: TAdminRegisterationData,
): TAdminRegisterationData => {
	try {
		if (!adminRegisterationData) throw new Error('No data provided');

		const adminRegisterData = adminRegisterDataSchema.parse(
			adminRegisterationData,
		);

		return adminRegisterData;
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			throw new Error(err.errors[0].message ?? 'Invalid data provided');
		}

		throw new Error('Invalid data provided');
	}
};

export const registerAdmin = async (
	adminRegisterationData: TAdminRegisterationData,
) => {
	try {
		const { email, password, role } = validateAdminRegisterationData(
			adminRegisterationData,
		);

		const adminExists = await prisma.admin.findUnique({
			where: {
				email,
			},
		});

		if (adminExists) {
			throw new Error(`'${role}' with email '${email}' already exists`);
		}

		const hashedPassword = await hashPassword(password);

		const newAdminData = await prisma.admin.create({
			data: {
				email,
				password: hashedPassword,
				role,
			},
			select: {
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return newAdminData;
	} catch (err: unknown) {
		throw err;
	}
};

export const loginAdmin = async (adminLoginData: any) => {};
