module.exports = (req, res, next) => {
  if (req.user?.type !== 'admin') {
    return res.error('NOT_AUTHORIZED_ADMIN');
  }
  next();
};
