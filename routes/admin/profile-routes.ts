import { Router } from 'express';
import { isSuperAdminOrAdminMiddleware } from '../../middlewares/is-super-admin-or-admin-middleware';
import {
	getAllAdminsController,
	getAdminByIdController,
	updateAdminByIdController,
} from '../../controllers/profile-controllers';

const adminProfileRoutes = Router();

/* --------- ADMINS INFO -------- */

/**
 * @path /api/v1/admin/profile
 * @method GET
 * @description Get all admins
 * @access Private
 */
adminProfileRoutes.get(
	'/',
	isSuperAdminOrAdminMiddleware,
	getAllAdminsController,
);

/**
 * @path /api/v1/admin/profile/:id
 * @method GET
 * @description Get admin by id
 * @access Private
 */
adminProfileRoutes.get(
	'/:id',
	isSuperAdminOrAdminMiddleware,
	getAdminByIdController,
);

/**
 * @path /api/v1/admin/profile/:id
 * @method PATCH
 * @description Update admin by id
 * @access Private
 */
adminProfileRoutes.patch(
	'/:id',
	isSuperAdminOrAdminMiddleware,
	updateAdminByIdController,
);

/**
 * @path /api/v1/admin/profile/:id
 * @method DELETE
 * @description Delete admin by id
 * @access Private
 */
adminProfileRoutes.delete('/:id', isSuperAdminOrAdminMiddleware, (req, res) => {
	res.json({ message: 'Delete admin by id' });
});

export default adminProfileRoutes;
