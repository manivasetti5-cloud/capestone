const prisma = require('../utils/db');

exports.getStates = async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' }
    });
    res.json(states);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      where: { stateId: req.params.id },
      select: { id: true, code: true, name: true, stateId: true },
      orderBy: { name: 'asc' }
    });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.getSubDistricts = async (req, res) => {
  try {
    const subDistricts = await prisma.subDistrict.findMany({
      where: { districtId: req.params.id },
      select: { id: true, code: true, name: true, districtId: true },
      orderBy: { name: 'asc' }
    });
    res.json(subDistricts);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.getVillages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const villages = await prisma.village.findMany({
      where: { subDistrictId: req.params.id },
      select: { id: true, code: true, name: true, subDistrictId: true },
      orderBy: { name: 'asc' },
      take: limit,
      skip: skip
    });
    res.json(villages);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.autocomplete = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, error: 'INVALID_QUERY', message: 'Query must be at least 2 characters' });
    }

    const villages = await prisma.village.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      include: {
        subDistrict: {
          include: {
            district: {
              include: {
                state: {
                  include: { country: true }
                }
              }
            }
          }
        }
      },
      take: parseInt(limit)
    });

    const formatted = villages.map(v => ({
      value: v.id,
      label: v.name,
      fullAddress: `${v.name}, ${v.subDistrict.name}, ${v.subDistrict.district.name}, ${v.subDistrict.district.state.name}, ${v.subDistrict.district.state.country.name}`,
      hierarchy: {
        village: v.name,
        subDistrict: v.subDistrict.name,
        district: v.subDistrict.district.name,
        state: v.subDistrict.district.state.name,
        country: v.subDistrict.district.state.country.name
      }
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.search = async (req, res) => {
  try {
    const { q, state, district, subDistrict, limit = 50 } = req.query;
    
    let whereClause = {};
    if (q) whereClause.name = { contains: q, mode: 'insensitive' };
    
    if (subDistrict) {
      whereClause.subDistrictId = subDistrict;
    } else if (district) {
      whereClause.subDistrict = { districtId: district };
    } else if (state) {
      whereClause.subDistrict = { district: { stateId: state } };
    }

    const villages = await prisma.village.findMany({
      where: whereClause,
      include: {
        subDistrict: {
          include: {
            district: {
              include: { state: true }
            }
          }
        }
      },
      take: parseInt(limit)
    });

    res.json(villages);
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};
