import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import type { BlogQuery, CreatePostInput, UpdatePostInput } from './schemas.js';

export async function getPosts(query: BlogQuery) {
  const limit = Math.min(parseInt(query.limit), 50);
  const where: any = { isPublished: true };
  if (query.category) where.category = query.category;
  if (query.tag) where.tags = { has: query.tag };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { excerpt: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.cursor) where.id = { lt: query.cursor };

  const posts = await prisma.blogPost.findMany({
    where, take: limit + 1,
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, category: true, readTime: true, publishedAt: true, imageUrl: true, tags: true },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, limit) : posts;
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null, hasMore };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) throw createError('Post not found', 404, 'NOT_FOUND');

  const related = await prisma.blogPost.findMany({
    where: { category: post.category, isPublished: true, id: { not: post.id } },
    take: 3,
    select: { id: true, slug: true, title: true, excerpt: true, imageUrl: true, readTime: true },
  });

  return { ...post, related };
}

export async function createPost(authorId: string, input: CreatePostInput) {
  const existing = await prisma.blogPost.findUnique({ where: { slug: input.slug } });
  if (existing) throw createError('Slug already exists', 409, 'SLUG_EXISTS');
  return prisma.blogPost.create({ data: { ...input, authorId } });
}

export async function updatePost(id: string, input: UpdatePostInput) {
  return prisma.blogPost.update({ where: { id }, data: input });
}

export async function deletePost(id: string) {
  return prisma.blogPost.update({ where: { id }, data: { isPublished: false } });
}

export async function getCategories() {
  const posts = await prisma.blogPost.groupBy({
    by: ['category'],
    where: { isPublished: true },
    _count: { category: true },
  });
  return posts.map(p => ({ category: p.category, count: p._count.category }));
}
