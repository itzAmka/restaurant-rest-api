import { z } from 'zod';

export const menuSchema = z.object({
	name: z.string({
		required_error: 'Please provide `name`',
		invalid_type_error: '`name` must be a string',
	}),
	description: z.string({
		required_error: 'Please provide `description`',
		invalid_type_error: '`description` must be a string',
	}),
	price: z.number({
		required_error: 'Please provide `price`',
		invalid_type_error: '`price` must be a number',
		coerce: true,
	}),
	categoryId: z.string({
		required_error: 'Please provide `categoryId`',
		invalid_type_error: '`categoryId` must be a string',
	}),
});

export type TMenu = z.infer<typeof menuSchema>;
