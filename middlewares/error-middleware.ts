import type { Request, Response, NextFunction } from 'express';
import { IServerError } from '../utils/server-error';

export const errorMiddleware = (
	err: IServerError,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// get status code from error object
	const statusCode = err.status ?? 500;

	res.status(statusCode).json({
		results: null,
		success: false,
		error: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack, // only show stack trace in development mode
	});
};
