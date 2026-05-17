import { logger } from './logger.js';

export interface InvoiceData {
  invoiceNumber: string;
  bookingRef: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerGstin?: string;
  serviceName: string;
  technicianName: string;
  paymentMethod: string;
  baseAmount: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
}

/**
 * Generate invoice PDF as Buffer.
 * Uses pdfkit when available; returns a minimal HTML-based fallback otherwise.
 * In production, swap the body for a full pdfkit or Puppeteer implementation.
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  logger.info(`[PDF] Generating invoice: ${data.invoiceNumber}`);

  // ── Minimal HTML invoice (replace with pdfkit/Puppeteer in production) ──
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${data.invoiceNumber}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
  .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
  .brand { font-size: 24px; font-weight: bold; color: #1B6B35; }
  .gstin { font-size: 11px; color: #666; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th { background: #1B6B35; color: white; padding: 10px; text-align: left; }
  td { padding: 10px; border-bottom: 1px solid #eee; }
  .total-row td { font-weight: bold; font-size: 16px; color: #1B6B35; }
  .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">🌿 PestShield Pro</div>
      <div class="gstin">GSTIN: 36AABCP1234Z1ZX</div>
      <div style="font-size:12px;color:#666;margin-top:8px">
        India's Most Trusted Pest Control Platform
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:20px;font-weight:bold">TAX INVOICE</div>
      <div style="color:#666">${data.invoiceNumber}</div>
      <div style="color:#666">${data.date}</div>
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;margin-bottom:24px">
    <div>
      <div style="font-weight:bold;margin-bottom:4px">Bill To:</div>
      <div>${data.customerName}</div>
      <div style="color:#666;font-size:13px">${data.customerPhone}</div>
      <div style="color:#666;font-size:13px">${data.customerAddress}</div>
      ${data.customerGstin ? `<div style="color:#666;font-size:13px">GSTIN: ${data.customerGstin}</div>` : ''}
    </div>
    <div style="text-align:right">
      <div><strong>Booking Ref:</strong> ${data.bookingRef}</div>
      <div><strong>Technician:</strong> ${data.technicianName}</div>
      <div><strong>Payment:</strong> ${data.paymentMethod}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th style="text-align:right">Amount (₹)</th></tr>
    </thead>
    <tbody>
      <tr><td>${data.serviceName}</td><td style="text-align:right">${data.baseAmount.toFixed(2)}</td></tr>
      ${data.discountAmount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-${data.discountAmount.toFixed(2)}</td></tr>` : ''}
      <tr><td>Subtotal</td><td style="text-align:right">${(data.baseAmount - data.discountAmount).toFixed(2)}</td></tr>
      <tr><td>GST @ 18% (CGST 9% + SGST 9%)</td><td style="text-align:right">${data.gstAmount.toFixed(2)}</td></tr>
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td>Total Amount Due</td>
        <td style="text-align:right">₹${data.totalAmount.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    This is a computer-generated invoice. No signature required.<br>
    PestShield Pro | support@pestshieldpro.in | +91-98765-43210
  </div>
</body>
</html>`;

  return Buffer.from(html, 'utf-8');
}
