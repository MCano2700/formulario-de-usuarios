const { sql, poolPromise } = require('../db');

const listarArticulos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT a.id, a.titulo, a.descripcion, a.precio, a.creado_en,
                     u.username as autor
              FROM articulos a
              JOIN usuarios u ON u.id = a.creado_por
              ORDER BY a.creado_en DESC`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al listar artículos:', err.message);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
};

const crearArticulo = async (req, res) => {
  const { titulo, descripcion, precio } = req.body;

  if (!titulo || !descripcion || precio === undefined)
    return res.status(400).json({ error: 'titulo, descripcion y precio son obligatorios' });

  if (isNaN(precio) || precio < 0)
    return res.status(400).json({ error: 'El precio debe ser un número positivo' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('titulo',      sql.VarChar,       titulo)
      .input('descripcion', sql.Text,          descripcion)
      .input('precio',      sql.Decimal(10,2), precio)
      .input('creado_por',  sql.Int,           req.usuario.id)
      .query(`INSERT INTO articulos (titulo, descripcion, precio, creado_por)
              VALUES (@titulo, @descripcion, @precio, @creado_por)`);

    res.status(201).json({ mensaje: 'Artículo creado correctamente' });
  } catch (err) {
    console.error('Error al crear artículo:', err.message);
    res.status(500).json({ error: 'Error al guardar el artículo' });
  }
};

module.exports = { listarArticulos, crearArticulo };