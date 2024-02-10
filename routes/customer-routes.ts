import { Router } from 'express';

import { createCustomerController } from '../controllers/customer-controllers';

const customerRoutes = Router();

/* -------- PUBLIC CUSTOMER ROUTES -------- */

/**
 * @path /api/v1/customers
 * @method POST
 * @description Create customer
 * @access Public
 */
customerRoutes.post('/', createCustomerController);

export default customerRoutes;
