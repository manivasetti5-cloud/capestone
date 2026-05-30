const prisma = require('../utils/db');

exports.getAnalytics = async (req, res) => {
  try {
    const totalVillages = await prisma.village.count();
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    
    // Get today's API requests
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todaysRequests = await prisma.apiLog.count({
      where: { createdAt: { gte: startOfDay } }
    });

    // Mock response time for now (would need aggregation)
    const avgResponseTime = 42;

    // Top states by village count (mocked for simplicity, true aggregation query requires grouping)
    // A raw query could be used for exact counts, e.g.:
    // SELECT s.name, COUNT(v.id) as villages FROM "Village" v JOIN "SubDistrict" sd ON v."subDistrictId" = sd.id JOIN "District" d ON sd."districtId" = d.id JOIN "State" s ON d."stateId" = s.id GROUP BY s.name ORDER BY villages DESC LIMIT 5
    const mockChartData = [
      { name: 'Maharashtra', villages: 40000 },
      { name: 'UP', villages: 100000 },
      { name: 'MP', villages: 55000 },
      { name: 'Bihar', villages: 45000 },
    ];

    res.json({
      success: true,
      stats: {
        totalVillages,
        totalUsers,
        todaysRequests,
        avgResponseTime
      },
      chartData: mockChartData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        businessName: true,
        email: true,
        planType: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' }
    });
    res.json({ success: true, message: 'User approved' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};
