import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      campaignName: 'Friendship Circle Chance Raffle',
      prizeDescription: 'Luxury Rolex Watch',
      cashValue: 1000000, // $10,000 in cents
      totalEntries: 360,
      isActive: true,
      overflowEnabled: false,
      overflowDuration: 180, // 3 hours
    },
  });
  console.log('Created settings:', settings.campaignName);

  // Create default admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@friendshipcircle.org' },
    update: {},
    create: {
      email: 'admin@friendshipcircle.org',
      passwordHash,
      name: 'Admin User',
    },
  });
  console.log('Created admin user:', admin.email);
  console.log('Default password: admin123 (CHANGE THIS IN PRODUCTION!)');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
