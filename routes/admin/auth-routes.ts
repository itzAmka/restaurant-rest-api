import { Router } from 'express';

import {
	registerAdminController,
	loginAdminController,
} from '../../controllers/auth-controller';

const adminAuthRoutes = Router();

/* ----------- ADMIN AUTH ----------- */

/**
 * @path /api/v1/admin/auth/register
 * @method POST
 * @description Create a new admin, only SUPER_ADMIN can create a new admin
 * @access Private
 */
adminAuthRoutes.post('/register', registerAdminController);

/**
 * @path /api/v1/admin/auth/login
 * @method POST
 * @description Login admin
 * @access Private
 */
adminAuthRoutes.post('/login', loginAdminController);

export default adminAuthRoutes;
