const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'Server is alive',
    service: 'TimeBank Backend',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};