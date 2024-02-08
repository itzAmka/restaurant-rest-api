import { z } from 'zod';
import dotenv from 'dotenv';

import { prisma } from '../../config/prisma';
import {
	adminRegisterDataSchema,
	adminLoginDataSchema,
	type TAdminRegisterationData,
	type TAdminLoginData,
} from '../../utils/schema/admin/auth-schema';
import { hashPassword } from '../../utils/hashing/hashPassword';
import { comparePasswords } from '../../utils/hashing/comparePasswords';
import { decodeToken } from '../../utils/token/decode-token';
import { getTokenStatus } from '../../utils/token/get-token-status';
import { generateToken } from '../../utils/token/generate-token';
import ServerError from '../../utils/server-error';

dotenv.config();

const validateAdminRegisterationData = (
	adminRegisterationData: TAdminRegisterationData,
): TAdminRegisterationData => {
	try {
		if (!adminRegisterationData) throw new ServerError(400, 'No data provided');

		const adminValidatedRegisterationData = adminRegisterDataSchema.parse(
			adminRegisterationData,
		);

		return adminValidatedRegisterationData;
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
			throw new ServerError(
				400,
				`'${role}' with email '${email}' already exists`,
			);
		}

		const hashedPassword = await hashPassword(password);

		const newAdminData = await prisma.admin.create({
			data: {
				email,
				password: hashedPassword,
				role,
			},
			select: {
				id: true,
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
		if (!adminLoginData) throw new ServerError(400, 'No data provided');

		const adminValidatedLoginData = adminLoginDataSchema.parse(adminLoginData);

		return adminValidatedLoginData;
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

export const loginAdmin = async (adminLoginData: TAdminLoginData) => {
	try {
		const { email, password } = validateAdminLoginData(adminLoginData);

		const admin = await prisma.admin.findUnique({
			where: {
				email,
			},
		});

		if (!admin) {
			throw new ServerError(400, 'Invalid credentials');
		}

		const isPasswordMatch = await comparePasswords(password, admin.password);

		if (!isPasswordMatch) {
			throw new ServerError(400, 'Invalid credentials');
		}

		const adminData = {
			id: admin.id,
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

export const refreshToken = async (
	accessToken: string,
	refreshToken: string,
) => {
	// throw error if no tokens provided
	if (!accessToken || !refreshToken) {
		throw new ServerError(401, 'Unauthorized, no tokens provided');
	}

	// throw error if no environment variables
	if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
		throw new ServerError(
			400,
			'Internal server error, failed to load environment variables',
		);
	}

	// decode tokens
	const decodedAccessToken = decodeToken(
		accessToken,
		process.env.ACCESS_TOKEN_SECRET,
	);
	const decodedRefreshToken = decodeToken(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
	);

	if (!decodedAccessToken || !decodedRefreshToken) {
		throw new ServerError(401, 'Unauthorized, invalid tokens');
	}

	// check if token id's are similar
	if (decodedAccessToken.token_id !== decodedRefreshToken.token_id) {
		throw new ServerError(401, 'Unauthorized, token id mismatch');
	}

	// get token status
	const accessTokenStatus = getTokenStatus(decodedAccessToken);
	const refreshTokenStatus = getTokenStatus(decodedRefreshToken);

	console.log({ accessTokenStatus, refreshTokenStatus });

	// cannot refresh token if both tokens are invalid
	if (
		accessTokenStatus.message === 'valid_token' &&
		refreshTokenStatus.message === 'valid_token'
	) {
		throw new ServerError(
			401,
			'Unauthorized, tokens are valid, no need to refresh',
		);
	}

	if (accessTokenStatus.message === 'valid_token') {
		throw new ServerError(
			401,
			'Unauthorized, access token is valid, no need to refresh',
		);
	}

	// invalid tokens
	if (
		accessTokenStatus.message === 'invalid_token' ||
		refreshTokenStatus.message === 'invalid_token'
	) {
		throw new ServerError(401, 'Unauthorized, invalid tokens');
	}

	// expired tokens
	if (
		accessTokenStatus.message === 'expired_token' &&
		refreshTokenStatus.message === 'expired_token'
	) {
		throw new ServerError(401, 'Unauthorized, both tokens are expired');
	}

	// refresh token is valid and access token is expired, generate new access token
	if (
		refreshTokenStatus.message === 'valid_token' &&
		accessTokenStatus.message === 'expired_token'
	) {
		const newAccessToken = generateToken({
			token_id: decodedRefreshToken.token_id,
			expires_in_minutes: 20,
			token_type: 'ACCESS_TOKEN',
			SECRET: process.env.ACCESS_TOKEN_SECRET,
		});

		return newAccessToken;
	}

	throw new ServerError(401, 'Unauthorized, invalid tokens');
};
