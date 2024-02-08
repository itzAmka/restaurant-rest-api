import { Router } from 'express';

import {
	registerAdminController,
	loginAdminController,
	refreshTokenController,
} from '../../controllers/auth-controller';
import { isSuperAdminMiddleware } from '../../middlewares/is-super-admin-middleware';

const adminAuthRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/auth/register
 * @method POST
 * @description Create a new admin, only SUPER_ADMIN can create a new admin
 * @access Private
 */
adminAuthRoutes.post(
	'/register',
	isSuperAdminMiddleware,
	registerAdminController,
);

/**
 * @path /api/v1/admin/auth/login
 * @method POST
 * @description Login admin
 * @access Private
 */
adminAuthRoutes.post('/login', loginAdminController);

/**
 * @path /api/v1/admin/auth/refresh-token
 * @method GET
 * @description Refresh access token
 * @access Private
 */
adminAuthRoutes.get('/refresh-token', refreshTokenController);

export default adminAuthRoutes;
