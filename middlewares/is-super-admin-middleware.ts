import { Request, Response, NextFunction } from 'express';
import AsyncHandler from 'express-async-handler';

import { decodeToken } from '../utils/token/decode-token';
import { getTokenStatus } from '../utils/token/get-token-status';
import { prisma } from '../config/prisma';

export const isSuperAdminMiddleware = AsyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers.authorization?.split(' ')[1];

		if (!accessToken) {
			res.status(401);
			throw new Error('Unauthorized, no token provided');
		}

		if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
			res.status(500);
			throw new Error(
				'Internal server error, failed to load environment variables',
			);
		}

		const decodedToken = decodeToken(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET,
		);

		if (!decodedToken) {
			res.status(401);
			throw new Error('Unauthorized, invalid token');
		}

		const tokenStatus = getTokenStatus(decodedToken);

		// check if token status is not valid
		if (tokenStatus.message === 'invalid_token') {
			res.status(401);
			throw new Error('Unauthorized, invalid token');
		}

		// check if token status is expired
		if (tokenStatus.message === 'expired_token') {
			res.status(401);
			throw new Error(
				'Unauthorized, token expired, please obtain a new one at: /api/v1/admin/auth/refresh-token',
			);
		}

		// if token is valid then check if user is a super admin
		const superAdmin = await prisma.admin.findUnique({
			where: {
				id: decodedToken.token_id,
			},
			select: {
				id: true,
				role: true,
			},
		});

		if (!superAdmin) {
			res.status(401);
			throw new Error('Unauthorized, cannot use this token');
		}

		if (superAdmin.role !== 'SUPER_ADMIN') {
			res.status(403);
			throw new Error('Forbidden, only SUPER_ADMIN can access this route');
		}

		next();
	},
);
