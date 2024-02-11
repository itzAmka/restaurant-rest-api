import { rateLimit } from 'express-rate-limit';

// 10 seconds per request for the same IP
export const rateLimiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	limit: 1,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});
