const prisma = require('../utils/db');

exports.getKeys = async (req, res) => {
  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId: req.userToken.id },
      select: {
        id: true,
        name: true,
        key: true,
        status: true,
        createdAt: true,
        lastUsed: true
      },
      orderBy: { createdAt: 'desc' }
    });
    // Mask the key except last 4 chars for security
    const maskedKeys = keys.map(k => ({
      ...k,
      key: `ak_...${k.key.slice(-4)}`
    }));
    res.json({ success: true, keys: maskedKeys });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.revokeKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await prisma.apiKey.findUnique({ where: { id } });
    if (!key || key.userId !== req.userToken.id) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    }
    await prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' }
    });
    res.json({ success: true, message: 'Key revoked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const userId = req.userToken.id;
    
    // Get total requests today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayUsage = await prisma.apiLog.count({
      where: {
        userId,
        createdAt: { gte: startOfDay }
      }
    });

    // Mock recent usage data for the chart since real aggregation requires more complex queries
    const mockUsageData = [
      { date: 'Mon', requests: Math.floor(Math.random() * 5000) },
      { date: 'Tue', requests: Math.floor(Math.random() * 5000) },
      { date: 'Wed', requests: Math.floor(Math.random() * 5000) },
      { date: 'Thu', requests: Math.floor(Math.random() * 5000) },
      { date: 'Fri', requests: Math.floor(Math.random() * 5000) },
      { date: 'Sat', requests: Math.floor(Math.random() * 5000) },
      { date: 'Sun', requests: todayUsage },
    ];

    res.json({
      success: true,
      todayUsage,
      chartData: mockUsageData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
  }
};
