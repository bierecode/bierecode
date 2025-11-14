import { defineCollection, z } from 'astro:content';

const updates = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    type: z.enum(['post', 'event']).default('post'),
    tags: z.array(z.string()).optional(),
    event: z.object({
      date: z.string().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      duration: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  updates,
};
