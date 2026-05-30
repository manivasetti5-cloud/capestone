const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:89191%40Mani@localhost:5432/all_india_villages?schema=public' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo data...');

  try {
    // 1. Create a dummy Country
    const country = await prisma.country.upsert({
      where: { code: 'IN' },
      update: {},
      create: { code: 'IN', name: 'India' }
    });

    // 2. Create a dummy State
    const state = await prisma.state.upsert({
      where: { code: 'MH' },
      update: {},
      create: { code: 'MH', name: 'Maharashtra', countryId: country.id }
    });

    // 3. Create a dummy District
    let district = await prisma.district.findFirst({ where: { code: 'NDB' } });
    if (!district) {
      district = await prisma.district.create({
        data: { code: 'NDB', name: 'Nandurbar', stateId: state.id }
      });
    }

    // 4. Create a dummy Sub-District
    let subDistrict = await prisma.subDistrict.findFirst({ where: { code: 'AKK' } });
    if (!subDistrict) {
      subDistrict = await prisma.subDistrict.create({
        data: { code: 'AKK', name: 'Akkalkuwa', districtId: district.id }
      });
    }

    // 5. Create a dummy Village
    await prisma.village.upsert({
      where: { code: '525002' },
      update: {},
      create: { code: '525002', name: 'Manibeli', subDistrictId: subDistrict.id }
    });

    // 6. Create Demo User and API Key
    const email = 'demo@innovate.in';
    const passwordHash = await bcrypt.hash('password123', 10);
    
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          businessName: 'Innovate Tech',
          planType: 'PRO',
          status: 'ACTIVE',
          role: 'USER'
        }
      });
    }

    // 7. Create Admin User
    const adminEmail = 'admin@innovate.in';
    let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          businessName: 'Platform Admin',
          planType: 'UNLIMITED',
          status: 'ACTIVE',
          role: 'ADMIN'
        }
      });
    }

    const demoKey = 'demo_public_key';
    const secretHash = await bcrypt.hash('demo_secret', 10);

    let apiKey = await prisma.apiKey.findUnique({ where: { key: demoKey } });
    if (!apiKey) {
      await prisma.apiKey.create({
        data: {
          name: 'Demo Presentation Key',
          key: demoKey,
          secretHash,
          userId: user.id,
          status: 'ACTIVE'
        }
      });
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
