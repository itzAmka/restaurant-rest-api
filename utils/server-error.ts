export interface IServerError extends Error {
	status: number;
}

export default class ServerError extends Error implements IServerError {
	status: number;

	constructor(status: number, message: string) {
		super(message);

		this.status = status;
		this.message = message;
	}
}
