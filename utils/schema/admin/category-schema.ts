import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type TCategoryData = z.infer<typeof categorySchema>;
