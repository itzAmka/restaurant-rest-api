import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import {
	getAllAdminsServices,
	getAdminByIdServices,
} from '../services/admin/profile-services';
import ServerError from '../utils/server-error';

export const getAllAdminsController = asyncHandler(
	async (req: Request, res: Response) => {
		const { searchTerm } = req.query as { searchTerm: string };

		// pagination
		const page = parseInt((req.query.page as string) ?? 1);
		const limit = parseInt((req.query.limit as string) ?? 10);
		const skip = (page - 1) * limit;

		// handle invalid page and limit
		if (page < 1 || limit < 1) {
			throw new ServerError(400, 'Invalid `page` or `limit`');
		}

		// limit cannot be greater than 20
		if (limit > 20) {
			throw new ServerError(400, '`limit` cannot be greater than 20');
		}

		const results = await getAllAdminsServices(searchTerm, { limit, skip });

		const totalPages = Math.ceil(results.totalCount / limit);
		const nextPage = page < totalPages ? page + 1 : null;
		const prevPage = page > 1 ? page - 1 : null;

		if (page > totalPages)
			throw new ServerError(400, `Cannot exceed total pages of ${totalPages}`);

		res.json({
			admins: results.admins,
			pagination: {
				limit,
				page,
				totalPages,
				nextPage,
				prevPage,
				totalCount: results.totalCount,
			},
		});
	},
);

export const getAdminByIdController = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const admin = await getAdminByIdServices(id);

		res.json({ admin });
	},
);
