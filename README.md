Backend en Node.js con autenticación de usuarios y gestión de artículos para venta. Usa Express, SQL Server y JWT.

---

## ¿Qué hace?

- Registro e inicio de sesión de usuarios con contraseña hasheada (bcrypt)
- Roles: admin y user
- Los administradores pueden crear artículos con título, descripción y precio
- Los usuarios estándar pueden consultar los artículos
- Autenticación con tokens JWT
- Logs de peticiones en consola con Morgan

---

## Requisitos

- Node.js v18 o superior
- SQL Server con una base de datos creada
- Git

---

## Instalación

bash
git clone https://github.com/mateo-EsRe/desarrolloweb.git
cd desarrolloweb
npm install


Crea un archivo .env en la raíz con esto:


PORT=3000
JWT_SECRET=tu_clave_secreta
DB_USER=sa
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_NAME=nombre_de_tu_base


Luego corre el servidor:

bash
npm run dev


---

## Tablas necesarias en SQL Server

sql
CREATE TABLE usuarios (
  id       INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol      VARCHAR(20)  NOT NULL DEFAULT 'user'
);

CREATE TABLE articulos (
  id          INT PRIMARY KEY IDENTITY(1,1),
  titulo      VARCHAR(200)  NOT NULL,
  descripcion TEXT          NOT NULL,
  precio      DECIMAL(10,2) NOT NULL,
  creado_por  INT           NOT NULL REFERENCES usuarios(id),
  creado_en   DATETIME      DEFAULT GETDATE()
);


---

## Endpoints

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET  | /api/auth/perfil | Ver perfil (requiere token) |

### Artículos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET  | /api/articulos | Listar artículos | Público |
| POST | /api/articulos | Crear artículo | Solo admin |

---

## Ejemplo de uso

*Registrar usuario:*
json
POST /api/auth/register
{
  "username": "juan",
  "password": "secreto123",
  "rol": "admin"
}


*Login:*
json
POST /api/auth/login
{
  "username": "juan",
  "password": "secreto123"
}


*Crear artículo* (header Authorization: Bearer <token>):
json
POST /api/articulos
{
  "titulo": "Camisa azul",
  "descripcion": "Camisa de algodón talla M",
  "precio": 29.99
}


---

## Estructura del proyecto


src/
├── controllers/
│   ├── auth.js
│   └── articulos.js
├── routes/
│   ├── auth.js
│   └── articulos.js
└── middleware/
    ├── auth.js
    └── esAdmin.js
public/
└── index.html
index.js


---

## Notas

- El .env no se sube al repositorio, cada quien debe crear el suyo
- Las contraseñas se guardan como hash, nunca en texto plano
- Si un usuario estándar intenta crear un artículo recibe un error 403
