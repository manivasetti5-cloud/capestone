require('dotenv').config();
const prisma = require('./utils/db');

async function cleanUp() {
  try {
    const dummyState = await prisma.state.findUnique({
      where: { code: 'MH' },
      include: {
        districts: {
          include: {
            subDistricts: {
              include: {
                villages: true
              }
            }
          }
        }
      }
    });

    if (!dummyState) {
      console.log('Dummy state not found');
      return;
    }

    console.log(`Found dummy state: ${dummyState.name}`);

    // Delete villages
    for (const d of dummyState.districts) {
      for (const sd of d.subDistricts) {
        await prisma.village.deleteMany({
          where: { subDistrictId: sd.id }
        });
      }
    }

    // Delete sub-districts
    for (const d of dummyState.districts) {
      await prisma.subDistrict.deleteMany({
        where: { districtId: d.id }
      });
    }

    // Delete districts
    await prisma.district.deleteMany({
      where: { stateId: dummyState.id }
    });

    // Delete State
    await prisma.state.delete({
      where: { id: dummyState.id }
    });

    console.log('Successfully deleted dummy data.');
  } catch (error) {
    console.error('Error cleaning up data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUp();
