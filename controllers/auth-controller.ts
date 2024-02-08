import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import dotevn from 'dotenv';

import {
	registerAdmin,
	loginAdmin,
	refreshToken as refreshTokenService,
} from '../services/admin/auth-services';
import { generateToken } from '../utils/token/generate-token';

dotevn.config();

// Register admin user
export const registerAdminController = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, password, role } = req.body;

		if (!email || !password || !role) {
			res.status(400);
			throw new Error('Please fill in all fields');
		}

		if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
			res.status(500);
			throw new Error(
				'Internal server error, failed to load environment variables',
			);
		}

		const newAdmin = await registerAdmin({
			email,
			password,
			role: role.toUpperCase(),
		});

		const accessToken = generateToken({
			token_id: newAdmin.id,
			expires_in_minutes: 20,
			SECRET: process.env.ACCESS_TOKEN_SECRET,
			token_type: 'ACCESS_TOKEN',
		});

		const refreshToken = generateToken({
			token_id: newAdmin.id,
			expires_in_minutes: 60,
			SECRET: process.env.REFRESH_TOKEN_SECRET,
			token_type: 'REFRESH_TOKEN',
		});

		res.json({
			newAdmin,
			accessToken,
			refreshToken,
		});
	},
);

// Login admin user
export const loginAdminController = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400);
			throw new Error('Please fill in all fields');
		}

		if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
			res.status(500);
			throw new Error(
				'Internal server error, failed to load environment variables',
			);
		}

		const admin = await loginAdmin({ email, password });

		const accessToken = generateToken({
			token_id: admin.id,
			expires_in_minutes: 20,
			SECRET: process.env.ACCESS_TOKEN_SECRET,
			token_type: 'ACCESS_TOKEN',
		});

		const refreshToken = generateToken({
			token_id: admin.id,
			expires_in_minutes: 60,
			SECRET: process.env.REFRESH_TOKEN_SECRET,
			token_type: 'REFRESH_TOKEN',
		});

		res.json({
			admin,
			accessToken,
			refreshToken,
		});
	},
);

// Refresh access token
export const refreshTokenController = asyncHandler(
	async (req: Request, res: Response) => {
		const accessToken = req.headers['x-access-token'] as string;
		const refreshToken = req.headers['x-refresh-token'] as string;

		if (!accessToken || !refreshToken) {
			res.status(400);
			throw new Error('Please provide access token and refresh token');
		}

		const newAccessToken = await refreshTokenService(accessToken, refreshToken);

		res.json({
			newAccessToken,
		});
	},
);
