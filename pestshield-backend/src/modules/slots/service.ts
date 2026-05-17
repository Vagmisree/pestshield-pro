import { prisma } from '../../config/db.js';
import { TimeSlot, PestType } from '@prisma/client';

const ALL_SLOTS: TimeSlot[] = [TimeSlot.MORNING, TimeSlot.AFTERNOON, TimeSlot.EVENING];

export async function getAvailableSlots(opts: {
  date: string;
  pincode: string;
  pestType?: string;
  technicianId?: string;
}) {
  const slotDate = new Date(opts.date);
  slotDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(slotDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Find technicians who serve this pincode area
  const techWhere: any = {
    isActive: true,
    status: 'AVAILABLE',
  };
  if (opts.pestType) {
    techWhere.skillTags = { has: opts.pestType as PestType };
  }
  if (opts.technicianId) {
    techWhere.id = opts.technicianId;
  }

  const technicians = await prisma.technician.findMany({ where: techWhere });

  // For each slot, count how many technicians are free
  const result: Record<TimeSlot, { available: boolean; count: number }> = {
    MORNING: { available: false, count: 0 },
    AFTERNOON: { available: false, count: 0 },
    EVENING: { available: false, count: 0 },
  };

  for (const slot of ALL_SLOTS) {
    // Count technicians who already have a booking in this slot
    const busyCount = await prisma.slot.count({
      where: {
        technicianId: { in: technicians.map((t) => t.id) },
        date: { gte: slotDate, lt: nextDay },
        timeSlot: slot,
        isAvailable: false,
      },
    });
    const freeCount = technicians.length - busyCount;
    result[slot] = { available: freeCount > 0, count: freeCount };
  }

  return { date: opts.date, pincode: opts.pincode, slots: result };
}
