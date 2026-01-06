module.exports = function (req, res, next) {
  const senha = req.headers['x-admin-password'];

  if (!senha || senha !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  next();
};