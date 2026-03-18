const sql = require('mssql');

const config = {
    user: 'sa', // Debe ser 'sa'
    password: 'admin123', // <--- LA QUE PUSISTE EN EL MANAGEMENT STUDIO
    server: 'localhost',
    database: 'conexion_visual',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('🚀 ¡CONEXIÓN EXITOSA A SQL SERVER!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
    });

module.exports = {
    sql,
    poolPromise
};