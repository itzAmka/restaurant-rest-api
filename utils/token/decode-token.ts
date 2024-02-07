import jwt from 'jsonwebtoken';
import type { TDecoded } from './token-types';

/**
 * @description Decode a JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {TDecoded | null} Decoded JWT token
 */
export const decodeToken = (token: string, secret: string): TDecoded | null => {
	try {
		return jwt.verify(token, secret) as TDecoded;
	} catch (error) {
		if (
			error instanceof jwt.JsonWebTokenError &&
			error.message === 'invalid signature'
		) {
			return null;
		}

		return null;
	}
};
