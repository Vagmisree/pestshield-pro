import { z } from 'zod';

export const blogQuerySchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'most-read']).default('newest'),
  cursor: z.string().optional(),
  limit: z.string().default('10'),
});

export const createPostSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  category: z.string(),
  readTime: z.string().default('5 min read'),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export type BlogQuery = z.infer<typeof blogQuerySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
