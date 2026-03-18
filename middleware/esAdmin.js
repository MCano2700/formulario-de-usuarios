function esAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Solo los administradores pueden hacer esto' });
  }
  next();
}

module.exports = esAdmin;