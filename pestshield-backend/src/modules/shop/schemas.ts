import { z } from 'zod';

export const productQuerySchema = z.object({
  category: z.string().optional(),
  pestType: z.string().optional(),
  inStock: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).default('newest'),
  page: z.string().default('1'),
  limit: z.string().default('20'),
});

export const createProductSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  category: z.string(),
  pestType: z.array(z.string()).default([]),
  imageUrls: z.array(z.string().url()).default([]),
  badge: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  deliveryAddress: z.string().min(10),
  paymentMethod: z.enum(['PREPAID', 'COD']).default('PREPAID'),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
