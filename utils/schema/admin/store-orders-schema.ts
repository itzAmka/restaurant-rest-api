import { z } from 'zod';

export const storeOrdersSchema = z.object({
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

export type TStoreOrdersSchema = z.infer<typeof storeOrdersSchema>;
