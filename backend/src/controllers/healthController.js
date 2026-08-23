exports.getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PlayBack API'
  });
};
