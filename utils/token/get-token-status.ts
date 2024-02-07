import { isPast, isFuture, differenceInMilliseconds } from 'date-fns';

import type { TDecoded, TTokenStatus } from './token-types';

/**
 * @description Get the status of a decoded JWT token
 * @param {TDecoded} decodedToken - Decoded JWT token
 * @returns {TTokenStatus} Token status message
 */
export const getTokenStatus = (decodedToken: TDecoded): TTokenStatus => {
	if (!decodedToken) {
		return { message: 'invalid_token' };
	}

	const { token_expiration_time } = decodedToken;

	const currentTime = Date.now();

	if (isPast(token_expiration_time)) {
		return { message: 'expired_token' };
	} else if (
		differenceInMilliseconds(token_expiration_time, currentTime) <= 0
	) {
		return { message: 'invalid_token' };
	} else if (isFuture(token_expiration_time)) {
		return { message: 'valid_token' };
	}

	return { message: 'invalid_token' };
};
