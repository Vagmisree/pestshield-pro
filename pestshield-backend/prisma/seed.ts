import { PrismaClient, UserRole, PestType, TechnicianStatus, BookingStatus, PaymentStatus, PlanType, PropertyType, TimeSlot, DiscountType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Seeding PestShield Pro database...\n');

  // ─── Clean existing data ──────────────────────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inspectionReport.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.serviceCatalogue.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleaned existing data');

  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pestshieldpro.in',
      phone: '9000000001',
      passwordHash: await bcrypt.hash('Admin@123', SALT_ROUNDS),
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
      admin: {
        create: {
          name: 'Super Admin',
          permissions: ['all'],
        },
      },
    },
  });
  console.log(`✅ Admin created: ${adminUser.email}`);

  // ─── Technicians ──────────────────────────────────────────────────────────
  const techData = [
    {
      name: 'Suresh Kumar',
      phone: '9100000001',
      email: 'suresh@pestshieldpro.in',
      skillTags: [PestType.COCKROACH, PestType.MOSQUITO, PestType.GENERAL],
      currentLat: 17.4400,
      currentLng: 78.3489,
    },
    {
      name: 'Ravi Shankar',
      phone: '9100000002',
      email: 'ravi@pestshieldpro.in',
      skillTags: [PestType.TERMITE, PestType.RODENT, PestType.BED_BUG],
      currentLat: 17.3616,
      currentLng: 78.4747,
    },
    {
      name: 'Manoj Yadav',
      phone: '9100000003',
      email: 'manoj@pestshieldpro.in',
      skillTags: [PestType.COCKROACH, PestType.TERMITE, PestType.GENERAL],
      currentLat: 17.4123,
      currentLng: 78.5098,
    },
  ];

  const technicians = [];
  for (const t of techData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        phone: t.phone,
        passwordHash: await bcrypt.hash('Tech@123', SALT_ROUNDS),
        role: UserRole.TECHNICIAN,
        isVerified: true,
        isActive: true,
        technician: {
          create: {
            name: t.name,
            phone: t.phone,
            skillTags: t.skillTags,
            currentLat: t.currentLat,
            currentLng: t.currentLng,
            status: TechnicianStatus.AVAILABLE,
            isActive: true,
            avgRating: 4.7 + Math.random() * 0.3,
            totalJobsCompleted: Math.floor(Math.random() * 200) + 50,
          },
        },
      },
      include: { technician: true },
    });
    technicians.push(user.technician!);
    console.log(`✅ Technician created: ${t.name} (${t.phone})`);
  }

  // ─── Customers ────────────────────────────────────────────────────────────
  const customerData = [
    { name: 'Priya Sharma', phone: '9200000001', email: 'priya@example.com' },
    { name: 'Ramesh Gupta', phone: '9200000002', email: 'ramesh@example.com' },
    { name: 'Anjali Singh', phone: '9200000003', email: 'anjali@example.com' },
  ];

  const customers = [];
  for (const c of customerData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        phone: c.phone,
        passwordHash: await bcrypt.hash('Customer@123', SALT_ROUNDS),
        role: UserRole.CUSTOMER,
        isVerified: true,
        isActive: true,
        customer: {
          create: {
            name: c.name,
            pincodes: ['500033', '500034'],
          },
        },
      },
      include: { customer: true },
    });
    customers.push(user.customer!);
    console.log(`✅ Customer created: ${c.name} (${c.phone})`);
  }

  // ─── Branch ───────────────────────────────────────────────────────────────
  await prisma.branch.create({
    data: {
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Plot 42, Jubilee Hills, Hyderabad 500033',
      phone: '9000000010',
      email: 'hyderabad@pestshieldpro.in',
      lat: 17.4239,
      lng: 78.4738,
      workingHours: '8:00 AM - 8:00 PM',
      serviceablePincodes: [
        '500001', '500002', '500003', '500004', '500008',
        '500016', '500033', '500034', '500072', '500081',
        '500082', '500084', '500085', '500090',
      ],
      isActive: true,
    },
  });
  console.log('✅ Branch created: Hyderabad HQ');

  // ─── Service Catalogue ────────────────────────────────────────────────────
  const serviceData = [
    { name: 'Cockroach Control', slug: 'cockroach-control', pestType: PestType.COCKROACH, basePrice: 999, pricePerSqFt: 0, duration: '60 min', method: 'Gel Bait + Spray', warranty: '30 days' },
    { name: 'Termite Control', slug: 'termite-control', pestType: PestType.TERMITE, basePrice: 2499, pricePerSqFt: 2, duration: '180 min', method: 'Soil Treatment + Bait', warranty: '1 year' },
    { name: 'Rodent Control', slug: 'rodent-control', pestType: PestType.RODENT, basePrice: 1499, pricePerSqFt: 0, duration: '90 min', method: 'Glue Traps + Rodenticide', warranty: '30 days' },
    { name: 'Mosquito Control', slug: 'mosquito-control', pestType: PestType.MOSQUITO, basePrice: 799, pricePerSqFt: 0, duration: '45 min', method: 'Fogging + Larvicide', warranty: '30 days' },
    { name: 'Bed Bug Control', slug: 'bed-bug-control', pestType: PestType.BED_BUG, basePrice: 1999, pricePerSqFt: 0, duration: '150 min', method: 'Heat Treatment + Spray', warranty: '60 days' },
    { name: 'General Pest Control', slug: 'general-pest-control', pestType: PestType.GENERAL, basePrice: 1299, pricePerSqFt: 1, duration: '120 min', method: 'Multi-Chemical', warranty: '30 days' },
  ];

  const services = [];
  for (const s of serviceData) {
    const svc = await prisma.serviceCatalogue.create({ data: { ...s, isActive: true } });
    services.push(svc);
  }
  console.log(`✅ ${services.length} services created`);

  // ─── Coupons ──────────────────────────────────────────────────────────────
  const now = new Date();
  await prisma.coupon.createMany({
    data: [
      {
        code: 'LAUNCH30',
        discountType: DiscountType.PERCENT,
        discountValue: 30,
        maxUses: 1000,
        usedCount: 0,
        validFrom: now,
        validUntil: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        isActive: true,
      },
      {
        code: 'FLAT200',
        discountType: DiscountType.FLAT,
        discountValue: 200,
        maxUses: 500,
        usedCount: 0,
        validFrom: now,
        validUntil: new Date(now.getFullYear(), now.getMonth() + 6, now.getDate()),
        isActive: true,
      },
    ],
  });
  console.log('✅ 2 coupons created: LAUNCH30, FLAT200');

  // ─── Sample Bookings ──────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  // Booking 1 — CONFIRMED (Priya, Cockroach)
  const booking1 = await prisma.booking.create({
    data: {
      bookingRef: 'PSP-2026-000001',
      customerId: customers[0].id,
      serviceId: services[0].id,
      planType: PlanType.SINGLE,
      propertyType: PropertyType.BHK_2,
      address: '12-3-456, Banjara Hills, Hyderabad',
      pincode: '500034',
      city: 'Hyderabad',
      slotDate: tomorrow,
      slotTime: TimeSlot.MORNING,
      status: BookingStatus.CONFIRMED,
      baseAmount: 999,
      discountAmount: 0,
      gstAmount: 179.82,
      totalAmount: 1178.82,
      paymentStatus: PaymentStatus.SUCCESS,
    },
  });

  // Booking 2 — TECHNICIAN_ASSIGNED (Ramesh, Termite)
  const booking2 = await prisma.booking.create({
    data: {
      bookingRef: 'PSP-2026-000002',
      customerId: customers[1].id,
      technicianId: technicians[1].id,
      serviceId: services[1].id,
      planType: PlanType.SINGLE,
      propertyType: PropertyType.VILLA,
      address: '8-2-293, Road No. 14, Jubilee Hills, Hyderabad',
      pincode: '500033',
      city: 'Hyderabad',
      slotDate: tomorrow,
      slotTime: TimeSlot.AFTERNOON,
      status: BookingStatus.TECHNICIAN_ASSIGNED,
      assignedAt: new Date(),
      baseAmount: 2499,
      discountAmount: 0,
      gstAmount: 449.82,
      totalAmount: 2948.82,
      paymentStatus: PaymentStatus.SUCCESS,
    },
  });

  // Booking 3 — COMPLETED (Anjali, Mosquito)
  const booking3 = await prisma.booking.create({
    data: {
      bookingRef: 'PSP-2026-000003',
      customerId: customers[2].id,
      technicianId: technicians[0].id,
      serviceId: services[3].id,
      planType: PlanType.SINGLE,
      propertyType: PropertyType.APARTMENT,
      address: '6-3-1090, Raj Bhavan Road, Somajiguda, Hyderabad',
      pincode: '500082',
      city: 'Hyderabad',
      slotDate: lastWeek,
      slotTime: TimeSlot.EVENING,
      status: BookingStatus.COMPLETED,
      assignedAt: lastWeek,
      completedAt: lastWeek,
      baseAmount: 799,
      discountAmount: 0,
      gstAmount: 143.82,
      totalAmount: 942.82,
      paymentStatus: PaymentStatus.SUCCESS,
    },
  });

  // Payment for booking 3
  await prisma.payment.create({
    data: {
      bookingId: booking3.id,
      customerId: customers[2].id,
      amount: 799,
      gst: 143.82,
      total: 942.82,
      gatewayOrderId: 'order_mock_seed001',
      gatewayPaymentId: 'pay_mock_seed001',
      status: PaymentStatus.SUCCESS,
    },
  });

  console.log('✅ 3 sample bookings created');
  console.log('\n🎉 Seed complete!\n');
  console.log('─'.repeat(50));
  console.log('Test credentials:');
  console.log('  Admin     : phone=9000000001  password=Admin@123');
  console.log('  Customer  : phone=9200000001  password=Customer@123');
  console.log('  Technician: phone=9100000001  password=Tech@123');
  console.log('  Mock OTP  : 123456');
  console.log('─'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
