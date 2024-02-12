import { Router } from 'express';

import {
	createStoreOrderController,
	getAllStoreOrdersController,
	getStoreOrderController,
	getStoreOrderByOrderNumberController,
	updateStoreOrderStatusController,
	deleteStoreOrderController,
} from '../../controllers/store-orders-controllers';
import { rateLimiter } from '../../config/rate-limiter';

const storeOrdersRoutes = Router();

/* ---------- ADMIN ORDERS ---------- */

/**
 * @path /api/v1/admin/store-orders
 * @method POST
 * @description Create a new order
 * @access Private
 */
storeOrdersRoutes.post('/', rateLimiter, createStoreOrderController);

/**
 * @path /api/v1/admin/store-orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
storeOrdersRoutes.get('/', getAllStoreOrdersController);

/**
 * @path /api/v1/admin/store-orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
storeOrdersRoutes.get('/:id', getStoreOrderController);

/**
 * @path /api/v1/admin/store-orders/order-number/:orderNumber
 * @method GET
 * @description Get order by order number
 * @access Private
 */
storeOrdersRoutes.get(
	'/order-number/:orderNumber',
	getStoreOrderByOrderNumberController,
);

/**
 * @path /api/v1/admin/store-orders/:id/status
 * @method PATCH
 * @description Update order status by id
 * @access Private
 */
storeOrdersRoutes.patch('/:id/status', updateStoreOrderStatusController);

/**
 * @path /api/v1/admin/store-orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
storeOrdersRoutes.delete('/:id', deleteStoreOrderController);

export default storeOrdersRoutes;
