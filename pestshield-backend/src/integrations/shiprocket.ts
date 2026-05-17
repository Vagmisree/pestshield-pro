import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let shiprocketToken: string | null = null;

async function getToken(): Promise<string | null> {
  if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) return null;
  if (shiprocketToken) return shiprocketToken;

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: env.SHIPROCKET_EMAIL, password: env.SHIPROCKET_PASSWORD }),
    });
    const data = await res.json() as any;
    shiprocketToken = data.token;
    return shiprocketToken;
  } catch (err) {
    logger.error('[Shiprocket] Auth failed:', err);
    return null;
  }
}

export async function createShipment(order: any): Promise<{ trackingId: string; awb: string }> {
  const token = await getToken();
  if (!token) {
    logger.warn('[Shiprocket] Not configured — mock shipment for order:', order.id);
    return { trackingId: `MOCK-${Date.now()}`, awb: `AWB-${Date.now()}` };
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        order_id: order.id,
        order_date: new Date().toISOString(),
        pickup_location: 'Primary',
        billing_customer_name: 'Customer',
        billing_address: order.deliveryAddress,
        billing_city: 'Hyderabad',
        billing_pincode: '500001',
        billing_state: 'Telangana',
        billing_country: 'India',
        billing_email: 'customer@pestshieldpro.in',
        billing_phone: '9876543210',
        shipping_is_billing: true,
        order_items: (order.items as any[]).map((i: any) => ({
          name: i.name, sku: i.productId, units: i.quantity, selling_price: i.price,
        })),
        payment_method: 'Prepaid',
        sub_total: order.totalAmount,
        length: 10, breadth: 10, height: 10, weight: 0.5,
      }),
    });
    const data = await res.json() as any;
    return { trackingId: data.shipment_id || `SR-${Date.now()}`, awb: data.awb_code || `AWB-${Date.now()}` };
  } catch (err) {
    logger.error('[Shiprocket] Create shipment failed:', err);
    return { trackingId: `MOCK-${Date.now()}`, awb: `AWB-${Date.now()}` };
  }
}

export async function trackShipment(trackingId: string): Promise<{ status: string; location: string; eta: string }> {
  const token = await getToken();
  if (!token) return { status: 'In Transit', location: 'Warehouse', eta: '2-3 days' };

  try {
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${trackingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json() as any;
    return {
      status: data.tracking_data?.shipment_status || 'In Transit',
      location: data.tracking_data?.current_location || 'Unknown',
      eta: data.tracking_data?.etd || 'N/A',
    };
  } catch (err) {
    return { status: 'In Transit', location: 'Unknown', eta: 'N/A' };
  }
}
