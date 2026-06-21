import { Request, Response, NextFunction } from 'express';
import * as bookingService from './service.js';
import type { CreateBookingInput, RescheduleInput, CancelInput, CloseBookingInput, BookingListQuery } from './schemas.js';

export async function bulkCreate(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.user!.userId;
    const { bookings } = req.body;
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ success: false, message: 'bookings array is required' });
    }
    const results = await bookingService.bulkCreateBookings(customerId, bookings);
    return res.status(201).json({ success: true, data: results });
  } catch (err) { next(err); }
}

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.user!.userId;
    const result = await bookingService.createBooking(customerId, req.body as CreateBookingInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function listBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.listBookings(
      req.user!.userId,
      req.user!.role,
      req.query as unknown as BookingListQuery
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.getBookingById(
      String(req.params.id),
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function rescheduleBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.rescheduleBooking(
      String(req.params.id),
      req.user!.userId,
      req.body as RescheduleInput
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.cancelBooking(
      String(req.params.id),
      req.user!.userId,
      req.user!.role,
      req.body as CancelInput
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function approveReport(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.approveReport(String(req.params.id), req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function closeBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.closeBooking(
      String(req.params.id),
      req.user!.userId,
      req.body as CloseBookingInput
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function checkPincode(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.checkPincode(String(req.params.pincode));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function sendClosureOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.sendClosureOtp(String(req.params.id), req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function markArrived(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await bookingService.markBookingArrived(String(req.params.id), req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
