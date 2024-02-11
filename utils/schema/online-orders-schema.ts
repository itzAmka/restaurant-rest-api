import { z } from 'zod';

export const onlineOrdersSchema = z.object({
	customerId: z.string({
		required_error: 'Please provide `customerId`',
		invalid_type_error: '`customerId` must be a string',
	}),
	orderItems: z.array(
		z.object({
			menuId: z.string({
				required_error: 'Please provide `menuIds`',
				invalid_type_error: '`menuIds` must be an array of strings',
			}),
			quantity: z.number({
				required_error: 'Please provide `quantity`',
				invalid_type_error: '`quantity` must be a number',
				coerce: true,
			}),
		}),
	),
});

export type TOnlineOrdersSchema = z.infer<typeof onlineOrdersSchema>;
