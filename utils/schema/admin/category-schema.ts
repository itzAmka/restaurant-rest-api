import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string({
		required_error: 'Please provide `name`',
		invalid_type_error: '`name` must be a string',
	}),
	description: z.string({
		required_error: 'Please provide `description`',
		invalid_type_error: '`description` must be a string',
	}),
});

export type TCategoryData = z.infer<typeof categorySchema>;
