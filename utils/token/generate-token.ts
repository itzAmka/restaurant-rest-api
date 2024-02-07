import jwt from 'jsonwebtoken';
import { addMinutes } from 'date-fns';

import type { TGenerateTokenArgs } from './token-types';

const generateEpochTime = (expiresInMinutes: number): number => {
	const currentTime = Date.now();
	return addMinutes(currentTime, expiresInMinutes).getTime();
};

/**
 * @description Generate a JWT token
 * @param {TGenerateTokenArgs} {
 * @returns {string} JWT token
 */
export const generateToken = ({
	token_id,
	expires_in_minutes,
	SECRET,
	token_type,
}: TGenerateTokenArgs): string => {
	if (
		!token_id ||
		typeof expires_in_minutes !== 'number' ||
		!SECRET ||
		!token_type
	) {
		throw new Error('Invalid data provided');
	}

	const expiresInMinutes = generateEpochTime(expires_in_minutes);

	const payload = {
		token_id,
		token_expiration_time: expiresInMinutes,
		token_type,
	};

	try {
		return jwt.sign(payload, SECRET, {
			expiresIn: '7d',
		});
	} catch (error) {
		throw new Error('Token generation failed');
	}
};
