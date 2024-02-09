import { z } from 'zod';

export const customerSchema = z.object({
	name: z
		.string({
			required_error: 'Please provide `name`',
			invalid_type_error: '`name` must be a string',
		})
		.min(2, 'Name must be at least 2 characters long'),
	email: z
		.string({
			required_error: 'Please provide `email`',
			invalid_type_error: '`email` must be a string',
		})
		.email({
			message: 'Please provide a valid email address',
		}),
	phone: z
		.string({
			required_error: 'Please provide `phone`',
			invalid_type_error: '`phone` must be a string',
		})
		.min(10, 'Phone number must be 10 digits long')
		.refine(
			(val) => {
				// pattern for phone number (555) 555-5555
				const pattern = /^\(\d{3}\) \d{3}-\d{4}$/;

				if (!pattern.test(val)) {
					// trim spaces
					val = val.trim();

					// remove all non-digits characters
					val = val.replace(/\D/g, '');

					// make sure it's 10 digits
					if (val.length !== 10) {
						return false;
					}

					// convert to correct format: (555) 555-5555
					val = val.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

					return val;
				}

				return val;
			},
			{
				message:
					'Phone number must be in the format `(555) 555-5555` and 10 digits long',
			},
		)
		.transform((val) => {
			// pattern for phone number (555) 555-5555
			const pattern = /^\(\d{3}\) \d{3}-\d{4}$/;

			if (!pattern.test(val)) {
				// trim spaces
				val = val.trim();

				// remove all non-digits characters
				val = val.replace(/\D/g, '');

				// make sure it's 10 digits
				if (val.length !== 10) {
					return false;
				}

				// convert to correct format: (555) 555-5555
				val = val.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

				return val;
			}

			return val;
		}),
});

export type TCustomer = z.infer<typeof customerSchema>;
