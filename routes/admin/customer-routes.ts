import { Router } from 'express';

const adminCustomerRoutes = Router();

/* -------- ADMIN CUSTOMERS -------- */

/**
 * @path /api/v1/admin/customers
 * @method GET
 * @description Get all customers
 * @access Private
 */
adminCustomerRoutes.get('/', (req, res) => {
	res.json({ message: 'Get all customers' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method GET
 * @description Get customer by id
 * @access Private
 */
adminCustomerRoutes.get('/:id', (req, res) => {
	res.json({ message: 'Get customer by id' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method PATCH
 * @description Update customer by id
 * @access Private
 */
adminCustomerRoutes.patch('/:id', (req, res) => {
	res.json({ message: 'Update customer by id' });
});

/**
 * @path /api/v1/admin/customers/:id
 * @method DELETE
 * @description Delete customer by id
 * @access Private
 */
adminCustomerRoutes.delete('/:id', (req, res) => {
	res.json({ message: 'Delete customer by id' });
});

export default adminCustomerRoutes;
