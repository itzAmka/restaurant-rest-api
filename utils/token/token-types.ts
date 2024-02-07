export type TTokenOption = 'ACCESS_TOKEN' | 'REFRESH_TOKEN';

export type TGenerateTokenArgs = {
	token_id: string;
	expires_in_minutes: number;
	SECRET: string;
	token_type: TTokenOption;
};

export type TDecoded = {
	token_id: string;
	token_expiration_time: number;
	token_type: TTokenOption;
};

export type TTokenStatus = {
	message: 'expired_token' | 'invalid_token' | 'valid_token';
};
