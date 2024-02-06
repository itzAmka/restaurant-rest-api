import { z, type ZodIssueOptionalMessage } from 'zod';

export const adminRegisterDataSchema = z.object({
	email: z
		.string({ required_error: 'Email is required!' })
		.email({ message: 'Please provide a valid email address' }),
	password: z
		.string({ required_error: 'Password is required!' })
		.min(6, { message: 'Password must be at least 6 characters long' }),
	role: z.enum(['ADMIN', 'MANAGER', 'STAFF'], {
		errorMap: (err: ZodIssueOptionalMessage) => {
			switch (err.code) {
				case 'invalid_type':
					return {
						message: `Role is required`,
					};
				case 'invalid_enum_value':
					return {
						message: `Role must be either 'ADMIN', 'MANAGER', or 'STAFF'`,
					};
				default:
					return {
						message: err.message ?? 'Invalid role provided',
					};
			}
		},
	}),
});

export type TAdminRegisterationData = z.infer<typeof adminRegisterDataSchema>;
