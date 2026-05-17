import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { parsePagination } from '../../utils/helpers.js';
import { createRazorpayOrder } from '../../integrations/razorpay.js';
import { createShipment } from '../../integrations/shiprocket.js';
import { OrderStatus } from '@prisma/client';
import type { ProductQuery, CreateProductInput, UpdateProductInput, CheckoutInput } from './schemas.js';

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(query: ProductQuery) {
  const { skip, limit } = parsePagination(query.page, query.limit);
  const where: any = { isActive: true };
  if (query.category) where.category = query.category;
  if (query.pestType) where.pestType = { has: query.pestType };
  if (query.inStock === 'true') where.stock = { gt: 0 };
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  const orderBy: any = query.sort === 'price_asc' ? { price: 'asc' }
    : query.sort === 'price_desc' ? { price: 'desc' }
    : { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy }),
    prisma.product.count({ where }),
  ]);
  return { products, total, page: Number(query.page), limit };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) throw createError('Product not found', 404, 'NOT_FOUND');
  return product;
}

export async function createProduct(input: CreateProductInput) {
  const existing = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (existing) throw createError('Slug already exists', 409, 'SLUG_EXISTS');
  return prisma.product.create({ data: input });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  return prisma.product.update({ where: { id }, data: input });
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export async function checkout(customerId: string, input: CheckoutInput) {
  // Validate stock and calculate total
  let totalAmount = 0;
  const orderItems: any[] = [];

  for (const item of input.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive) throw createError(`Product ${item.productId} not found`, 404, 'PRODUCT_NOT_FOUND');
    if (product.stock < item.quantity) throw createError(`Insufficient stock for ${product.name}`, 400, 'INSUFFICIENT_STOCK');

    totalAmount += product.price * item.quantity;
    orderItems.push({ productId: product.id, name: product.name, quantity: item.quantity, price: product.price });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId,
      items: orderItems,
      totalAmount,
      deliveryAddress: input.deliveryAddress,
      status: OrderStatus.PLACED,
    },
  });

  // Decrement stock
  for (const item of input.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Create Razorpay order for prepaid
  if (input.paymentMethod === 'PREPAID') {
    const rpOrder = await createRazorpayOrder(Math.round(totalAmount * 100), order.id);
    return { order, razorpayOrderId: rpOrder.id, amount: Math.round(totalAmount * 100) };
  }

  return { order };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(requesterId: string, requesterRole: string, page = 1, limit = 20) {
  const { skip } = parsePagination(page, limit);
  const where: any = {};
  if (requesterRole === 'CUSTOMER') where.customerId = requesterId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where }),
  ]);
  return { orders, total };
}

export async function getOrderById(orderId: string, requesterId: string, requesterRole: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw createError('Order not found', 404, 'NOT_FOUND');
  if (requesterRole === 'CUSTOMER' && order.customerId !== requesterId) throw createError('Access denied', 403, 'FORBIDDEN');
  return order;
}

// ─── Ship Order ───────────────────────────────────────────────────────────────

export async function shipOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw createError('Order not found', 404, 'NOT_FOUND');

  const { trackingId, awb } = await createShipment(order);

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.SHIPPED, trackingId, shiprocketOrderId: awb },
  });
}
