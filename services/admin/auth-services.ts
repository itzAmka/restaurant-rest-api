import { z } from 'zod';

import { prisma } from '../../config/prisma';
import {
	adminRegisterDataSchema,
	adminLoginDataSchema,
	type TAdminRegisterationData,
	type TAdminLoginData,
} from '../../utils/schema/admin/auth-schema';
import { hashPassword } from '../../utils/hashing/hashPassword';
import { comparePasswords } from '../../utils/hashing/comparePasswords';

const validateAdminRegisterationData = (
	adminRegisterationData: TAdminRegisterationData,
): TAdminRegisterationData => {
	try {
		if (!adminRegisterationData) throw new Error('No data provided');

		const adminValidatedRegisterationData = adminRegisterDataSchema.parse(
			adminRegisterationData,
		);

		return adminValidatedRegisterationData;
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

const validateAdminLoginData = (
	adminLoginData: TAdminLoginData,
): TAdminLoginData => {
	try {
		if (!adminLoginData) throw new Error('No data provided');

		const adminValidatedLoginData = adminLoginDataSchema.parse(adminLoginData);

		return adminValidatedLoginData;
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			throw new Error(err.errors[0].message ?? 'Invalid data provided');
		}

		throw new Error('Invalid data provided');
	}
};

export const loginAdmin = async (adminLoginData: TAdminLoginData) => {
	try {
		const { email, password } = validateAdminLoginData(adminLoginData);

		const admin = await prisma.admin.findUnique({
			where: {
				email,
			},
		});

		if (!admin) {
			throw new Error('Invalid credentials');
		}

		const isPasswordMatch = await comparePasswords(password, admin.password);

		if (!isPasswordMatch) {
			throw new Error('Invalid credentials');
		}

		const adminData = {
			email: admin.email,
			role: admin.role,
			createdAt: admin.createdAt,
			updatedAt: admin.updatedAt,
		};

		return adminData;
	} catch (err: unknown) {
		throw err;
	}
};
