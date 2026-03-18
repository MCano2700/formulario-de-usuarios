const express        = require('express');
const router         = express.Router();
const { listarArticulos, crearArticulo } = require('../controllers/articulos');
const verificarToken = require('../middleware/auth');
const esAdmin        = require('../middleware/esAdmin');

router.get('/',  listarArticulos);
router.post('/', verificarToken, esAdmin, crearArticulo);

module.exports = router;