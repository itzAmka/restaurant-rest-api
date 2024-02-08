import { Request, Response, NextFunction } from 'express';
import AsyncHandler from 'express-async-handler';

import { decodeToken } from '../utils/token/decode-token';
import { getTokenStatus } from '../utils/token/get-token-status';
import { prisma } from '../config/prisma';
import ServerError from '../utils/server-error';

export const isSuperAdminOrAdminMiddleware = AsyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers.authorization?.split(' ')[1];

		if (!accessToken) {
			throw new ServerError(401, 'Unauthorized, no token provided');
		}

		if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
			throw new ServerError(
				500,
				'Internal server error, failed to load environment variables',
			);
		}

		const decodedToken = decodeToken(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET,
		);

		if (!decodedToken) {
			throw new ServerError(401, 'Unauthorized, invalid token');
		}

		const tokenStatus = getTokenStatus(decodedToken);

		// check if token status is not valid
		if (tokenStatus.message === 'invalid_token') {
			throw new ServerError(401, 'Unauthorized, invalid token');
		}

		// check if token status is expired
		if (tokenStatus.message === 'expired_token') {
			throw new ServerError(
				401,
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
			throw new ServerError(401, 'Unauthorized, cannot use this token');
		}

		if (superAdmin.role !== 'SUPER_ADMIN' && superAdmin.role !== 'ADMIN') {
			throw new ServerError(
				403,
				'Forbidden, only SUPER_ADMIN or ADMIN can access this rout',
			);
		}

		next();
	},
);
