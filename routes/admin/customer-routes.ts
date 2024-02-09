import { Router } from 'express';

import {
	createCustomerController,
	getAllCustomersController,
	getCustomerByIdController,
	updateCustomerController,
	deleteCustomerController,
} from '../../controllers/customer-controllers';

const adminCustomerRoutes = Router();

/* -------- ADMIN CUSTOMERS -------- */

/**
 * @path /api/v1/admin/customers
 * @method GET
 * @description Get all customers
 * @access Private
 */
adminCustomerRoutes.get('/', getAllCustomersController);

/**
 * @path /api/v1/admin/customers
 * @method POST
 * @description Create customer
 * @access Private
 */
adminCustomerRoutes.post('/', createCustomerController);

/**
 * @path /api/v1/admin/customers/:id
 * @method GET
 * @description Get customer by id
 * @access Private
 */
adminCustomerRoutes.get('/:id', getCustomerByIdController);

/**
 * @path /api/v1/admin/customers/:id
 * @method PATCH
 * @description Update customer by id
 * @access Private
 */
adminCustomerRoutes.patch('/:id', updateCustomerController);

/**
 * @path /api/v1/admin/customers/:id
 * @method DELETE
 * @description Delete customer by id
 * @access Private
 */
adminCustomerRoutes.delete('/:id', deleteCustomerController);

export default adminCustomerRoutes;
