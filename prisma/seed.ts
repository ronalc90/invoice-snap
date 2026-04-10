import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'ronald@invoicesnap.dev' },
    update: {},
    create: {
      email: 'ronald@invoicesnap.dev',
      name: 'Ronald',
      businessName: 'Ronald Dev Studio',
      businessAddress: '123 Main St, San Francisco, CA 94102',
      phone: '+1 (555) 123-4567',
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Maria Garcia',
        email: 'maria@techstartup.com',
        phone: '+1 (555) 234-5678',
        company: 'TechStartup Inc.',
        address: '456 Innovation Blvd, Austin, TX 73301',
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'James Wilson',
        email: 'james@designco.com',
        phone: '+1 (555) 345-6789',
        company: 'DesignCo',
        address: '789 Creative Ave, Portland, OR 97201',
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Sarah Chen',
        email: 'sarah@ecommerce.io',
        phone: '+1 (555) 456-7890',
        company: 'E-Commerce Solutions',
        address: '321 Market St, Seattle, WA 98101',
      },
    }),
  ]);

  console.log(`Created ${clients.length} clients`);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fifteenDaysFromNow = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  // Create invoices with items
  const invoice1 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: clients[0].id,
      invoiceNumber: 'INV-2024-0001',
      status: 'PAID',
      issueDate: thirtyDaysAgo,
      dueDate: now,
      subtotal: 5000,
      taxRate: 10,
      taxAmount: 500,
      total: 5500,
      currency: 'USD',
      notes: 'Thank you for your business!',
      sentAt: thirtyDaysAgo,
      viewedAt: thirtyDaysAgo,
      paidAt: fifteenDaysAgo,
      items: {
        create: [
          {
            description: 'Website Development - Landing Page',
            quantity: 1,
            unitPrice: 3000,
            amount: 3000,
          },
          {
            description: 'UI/UX Design',
            quantity: 10,
            unitPrice: 150,
            amount: 1500,
          },
          {
            description: 'SEO Optimization',
            quantity: 1,
            unitPrice: 500,
            amount: 500,
          },
        ],
      },
    },
  });

  // Payment for invoice 1
  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 5500,
      paymentDate: fifteenDaysAgo,
      paymentMethod: 'Bank Transfer',
      reference: 'TRF-2024-001',
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: clients[1].id,
      invoiceNumber: 'INV-2024-0002',
      status: 'SENT',
      issueDate: fifteenDaysAgo,
      dueDate: fifteenDaysFromNow,
      subtotal: 8500,
      taxRate: 10,
      taxAmount: 850,
      total: 9350,
      currency: 'USD',
      notes: 'Payment due within 30 days.',
      sentAt: fifteenDaysAgo,
      items: {
        create: [
          {
            description: 'Mobile App Development - Phase 1',
            quantity: 1,
            unitPrice: 6000,
            amount: 6000,
          },
          {
            description: 'API Integration',
            quantity: 5,
            unitPrice: 500,
            amount: 2500,
          },
        ],
      },
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: clients[2].id,
      invoiceNumber: 'INV-2024-0003',
      status: 'OVERDUE',
      issueDate: thirtyDaysAgo,
      dueDate: fiveDaysAgo,
      subtotal: 3200,
      taxRate: 8,
      taxAmount: 256,
      total: 3456,
      currency: 'USD',
      notes: 'This invoice is past due. Please remit payment immediately.',
      sentAt: thirtyDaysAgo,
      viewedAt: thirtyDaysAgo,
      items: {
        create: [
          {
            description: 'E-commerce Platform Maintenance',
            quantity: 8,
            unitPrice: 200,
            amount: 1600,
          },
          {
            description: 'Bug Fixes & Performance Optimization',
            quantity: 16,
            unitPrice: 100,
            amount: 1600,
          },
        ],
      },
    },
  });

  const invoice4 = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: clients[0].id,
      invoiceNumber: 'INV-2024-0004',
      status: 'DRAFT',
      issueDate: now,
      dueDate: thirtyDaysFromNow,
      subtotal: 4500,
      taxRate: 10,
      taxAmount: 450,
      total: 4950,
      currency: 'USD',
      items: {
        create: [
          {
            description: 'Dashboard Feature Development',
            quantity: 1,
            unitPrice: 4500,
            amount: 4500,
          },
        ],
      },
    },
  });

  console.log('Created 4 invoices with items and payments');
  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
