import { Redis } from 'ioredis';
import dotenv from 'dotenv';

import ServerError from '../utils/server-error';

dotenv.config();

const REDIS_URI = process.env.REDIS_URI;

if (!REDIS_URI) {
	throw new ServerError(500, 'Redis URI not found');
}

export const redis = new Redis(REDIS_URI);
