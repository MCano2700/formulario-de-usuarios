const { sql, poolPromise } = require('../db');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { username, password, rol = 'user' } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'username y password son obligatorios' });

  try {
    const pool = await poolPromise;
    const hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hash)
      .input('rol',      sql.VarChar, rol)
      .query(`INSERT INTO usuarios (username, password, rol) 
              VALUES (@username, @password, @rol)`);

    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (err) {
    console.error('Error en registro:', err.message);
    if (err.message.includes('UNIQUE') || err.message.includes('duplicate'))
      return res.status(409).json({ error: 'El username ya está en uso' });
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM usuarios WHERE username = @username');

    const usuario = result.recordset[0];

    if (!usuario)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const perfil = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.usuario.id)
      .query('SELECT id, username, rol FROM usuarios WHERE id = @id');

    const usuario = result.recordset[0];
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { register, login, perfil };