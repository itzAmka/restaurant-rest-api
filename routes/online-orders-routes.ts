import { Router } from 'express';

import { rateLimiter } from '../config/rate-limiter';
import {
	createOnlineOrderController,
	getAllOnlineOrdersController,
	getOnlineOrderController,
	updateOnlineOrderController,
	updateOnlineOrderStatusController,
	deleteOnlineOrderController,
} from '../controllers/online-orders-controllers';

const onlineOrdersRoutes = Router();

/* ---------- ONLINE ORDERS ---------- */

/**
 * @path /api/v1/online-orders
 * @method POST
 * @description Create a new order
 * @access Public
 */
onlineOrdersRoutes.post('/', rateLimiter, createOnlineOrderController);

/**
 * @path /api/v1/online-orders
 * @method GET
 * @description Get all orders
 * @access Private
 */
onlineOrdersRoutes.get('/', getAllOnlineOrdersController);

/**
 * @path /api/v1/online-orders/:id
 * @method GET
 * @description Get order by id
 * @access Private
 */
onlineOrdersRoutes.get('/:id', getOnlineOrderController);

/**
 * @path /api/v1/online-orders/:id
 * @method PATCH
 * @description Update order by id
 * @access Private
 */
onlineOrdersRoutes.patch('/:id', updateOnlineOrderController);

/**
 * @path /api/v1/online-orders/:id/status
 * @method PATCH
 * @description Update order status by id
 * @access Private
 */
onlineOrdersRoutes.patch('/:id/status', updateOnlineOrderStatusController);

/**
 * @path /api/v1/online-orders/:id
 * @method DELETE
 * @description Delete order by id
 * @access Private
 */
onlineOrdersRoutes.delete('/:id', deleteOnlineOrderController);

export default onlineOrdersRoutes;
