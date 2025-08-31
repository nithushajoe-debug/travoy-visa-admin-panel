import { PrismaClient, Role, UserStatus, LeadStatus, CaseStage, Priority } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@travoy.com',
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'manager@travoy.com',
      name: 'Office Manager',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'consultant@travoy.com',
      name: 'Visa Consultant',
      role: Role.STAFF,
      status: UserStatus.ACTIVE,
    },
  });

  // Create contacts
  const contact1 = await prisma.contact.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+44 7700 900123',
      company: 'Tech Corp Ltd',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      phone: '+44 7700 900456',
    },
  });

  // Create leads
  const lead1 = await prisma.lead.create({
    data: {
      source: 'Website',
      status: LeadStatus.QUALIFIED,
      notes: 'Interested in UK work visa',
      ownerId: staff.id,
      contactId: contact1.id,
    },
  });

  // Create cases
  const case1 = await prisma.case.create({
    data: {
      contactId: contact1.id,
      visaType: 'Skilled Worker Visa',
      country: 'UK',
      stage: CaseStage.DOCUMENTS,
      priority: Priority.HIGH,
      assignedTo: staff.id,
      dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: 'Client has job offer from Tech Corp Ltd',
    },
  });

  const case2 = await prisma.case.create({
    data: {
      contactId: contact2.id,
      visaType: 'Standard Visitor Visa',
      country: 'UK',
      stage: CaseStage.NEW,
      priority: Priority.MEDIUM,
      assignedTo: staff.id,
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      notes: 'Tourism visit for 2 weeks',
    },
  });

  // Create tasks
  await prisma.task.create({
    data: {
      caseId: case1.id,
      title: 'Collect passport copies',
      description: 'Request passport bio pages from client',
      assigneeId: staff.id,
      dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  });

  await prisma.task.create({
    data: {
      caseId: case1.id,
      title: 'Review job offer letter',
      description: 'Verify job offer meets visa requirements',
      assigneeId: staff.id,
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
  });

  // Create email templates
  await prisma.emailTemplate.create({
    data: {
      name: 'welcome_client',
      subject: 'Welcome to Travoy - Your Visa Application Journey Begins',
      bodyMd: `# Welcome {{CLIENT_NAME}}!

Thank you for choosing Travoy for your {{VISA_TYPE}} application to {{COUNTRY}}.

## Next Steps:
1. Upload required documents via your portal
2. Complete the application form
3. Schedule your appointment

Your case reference: **{{CASE_ID}}**

Best regards,  
The Travoy Team`,
      variables: ['CLIENT_NAME', 'VISA_TYPE', 'COUNTRY', 'CASE_ID'],
    },
  });

  await prisma.emailTemplate.create({
    data: {
      name: 'missing_documents',
      subject: 'Documents Required - {{CASE_ID}}',
      bodyMd: `Hi {{CLIENT_NAME}},

To proceed with your {{VISA_TYPE}} application, we still need:

{{MISSING_DOCS}}

Please upload these documents via your portal: {{PORTAL_URL}}

Best regards,  
{{STAFF_NAME}}`,
      variables: ['CLIENT_NAME', 'VISA_TYPE', 'MISSING_DOCS', 'PORTAL_URL', 'STAFF_NAME'],
    },
  });

  // Create WhatsApp templates
  await prisma.whatsAppTemplate.create({
    data: {
      name: 'status_update',
      language: 'en',
      category: 'UTILITY',
      bodyText: 'Hi {{1}}, your {{2}} visa application is now at stage: {{3}}. Reply here for any questions. - Travoy',
      variables: ['CLIENT_NAME', 'VISA_TYPE', 'STAGE'],
      approved: true,
    },
  });

  // Create sample invoice
  await prisma.invoice.create({
    data: {
      caseId: case1.id,
      number: 'INV-2025-001',
      amount: 1500.00,
      currency: 'GBP',
      issuedAt: new Date(),
      dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: 'Skilled Worker Visa consultation and application',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Super Admin: admin@travoy.com`);
  console.log(`👤 Admin: manager@travoy.com`);
  console.log(`👤 Staff: consultant@travoy.com`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });