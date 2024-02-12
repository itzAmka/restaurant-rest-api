import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

import ServerError from '../utils/server-error';

dotenv.config();

const { ALLOWED_ORIGINS } = process.env;

if (!ALLOWED_ORIGINS) {
	throw new ServerError(500, '`ALLOWED_ORIGINS` not set in .env');
}

const whitelistURLs = JSON.parse(ALLOWED_ORIGINS ?? '[]');

console.log(whitelistURLs);

export const corsOptions: CorsOptions = {
	origin: (origin: string | undefined, callback: Function) => {
		if (whitelistURLs.indexOf(origin!) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new ServerError(401, `${origin} - Unauthorized.`), false);
		}
	},
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	credentials: true,
	optionsSuccessStatus: 200,
};
