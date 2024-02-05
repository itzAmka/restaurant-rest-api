import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// get status code and set to 500 if its 200, else use the status code
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	res.status(statusCode).json({
		results: null,
		success: false,
		error: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack, // only show stack trace in development mode
	});
};
