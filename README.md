# API REST de Usuarios — Prueba Técnica C2Lab

API REST desarrollada con Node.js, Express, MongoDB y Mongoose para gestionar usuarios y sus direcciones, según lo solicitado en la prueba técnica.

El proyecto permite crear, consultar, actualizar, eliminar y buscar usuarios por ciudad. También incluye paginación, validación de datos y manejo centralizado de errores.

## Tecnologías

- Node.js
- Express 5
- MongoDB 8
- Mongoose
- dotenv
- Docker Compose

## Requisitos

- Node.js `20.19.0` o superior
- npm
- Docker Desktop

También es posible utilizar una instalación local de MongoDB en lugar de Docker.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/juanodsk/prueba-c2lab.git
cd prueba-c2lab
```

Instalar las dependencias:

```bash
npm install
```

Crea un archivo llamado `.env` en la raíz del proyecto desde Visual Studio Code. El archivo debe contener:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/prueba_backend
```

## Iniciar MongoDB con Docker

Antes de ejecutar los siguientes comandos, inicia Docker Desktop.

Iniciar el contenedor de MongoDB:

```bash
docker compose up -d mongodb
```

Verificar el estado del contenedor:

```bash
docker compose ps
```

La información de MongoDB se conserva en el volumen `mongodb_data`.

Para detener el contenedor:

```bash
docker compose stop mongodb
```

## Ejecutar la aplicación

Modo desarrollo con reinicio automático:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:3000
```

Para verificar que está funcionando:

```http
GET http://localhost:3000/
```

Respuesta:

```json
{
  "message": "API de usuarios funcionando"
}
```

## Modelo de usuario

| Campo            | Tipo   | Obligatorio | Descripción                          |
| ---------------- | ------ | ----------: | ------------------------------------ |
| `nombre`         | String |          Sí | Nombre del usuario                   |
| `email`          | String |          Sí | Email válido y único                 |
| `edad`           | Number |          No | Número entero igual o mayor que cero |
| `fecha_creacion` | Date   |  Automático | Fecha de creación del usuario        |
| `direcciones`    | Array  |          No | Lista de direcciones del usuario     |

Cada dirección debe contener:

| Campo           | Tipo   | Obligatorio |
| --------------- | ------ | ----------: |
| `calle`         | String |          Sí |
| `ciudad`        | String |          Sí |
| `pais`          | String |          Sí |
| `codigo_postal` | String |          Sí |

El código postal se almacena como texto para conservar ceros iniciales y permitir códigos alfanuméricos.

## Endpoints

| Método   | Endpoint                       | Descripción                        |
| -------- | ------------------------------ | ---------------------------------- |
| `GET`    | `/`                            | Verificar el estado de la API      |
| `POST`   | `/usuarios`                    | Crear un usuario                   |
| `GET`    | `/usuarios`                    | Listar usuarios con paginación     |
| `GET`    | `/usuarios/buscar?ciudad=Lima` | Buscar usuarios por ciudad         |
| `GET`    | `/usuarios/:id`                | Consultar un usuario por ID        |
| `PUT`    | `/usuarios/:id`                | Actualizar parcialmente un usuario |
| `DELETE` | `/usuarios/:id`                | Eliminar un usuario                |

## Crear un usuario

```http
POST /usuarios
Content-Type: application/json
```

Body:

```json
{
  "nombre": "Ana Torres",
  "email": "ana.torres@example.com",
  "edad": 25,
  "direcciones": [
    {
      "calle": "Av. Principal 123",
      "ciudad": "Lima",
      "pais": "Perú",
      "codigo_postal": "00501"
    }
  ]
}
```

Respuesta exitosa: `201 Created`

```json
{
  "mensaje": "Usuario creado correctamente",
  "data": {
    "_id": "64f123456789abcdef123456",
    "nombre": "Ana Torres",
    "email": "ana.torres@example.com",
    "edad": 25,
    "fecha_creacion": "2026-08-06T12:00:00.000Z",
    "direcciones": [
      {
        "calle": "Av. Principal 123",
        "ciudad": "Lima",
        "pais": "Perú",
        "codigo_postal": "00501"
      }
    ]
  }
}
```

## Listar usuarios

```http
GET /usuarios
```

La paginación utiliza los siguientes valores predeterminados:

- `page=1`
- `limit=10`

También pueden enviarse explícitamente:

```http
GET /usuarios?page=1&limit=5
```

El límite máximo permitido es `100`.

Respuesta:

```json
{
  "data": [],
  "paginacion": {
    "paginaActual": 1,
    "limite": 5,
    "totalUsuarios": 0,
    "totalPaginas": 0,
    "tienePaginaAnterior": false,
    "tienePaginaSiguiente": false
  }
}
```

Los usuarios se ordenan desde el más reciente hasta el más antiguo.

## Consultar un usuario por ID

```http
GET /usuarios/64f123456789abcdef123456
```

Respuesta exitosa: `200 OK`

```json
{
  "data": {
    "_id": "64f123456789abcdef123456",
    "nombre": "Ana Torres",
    "email": "ana.torres@example.com",
    "edad": 25,
    "fecha_creacion": "2026-08-06T12:00:00.000Z",
    "direcciones": []
  }
}
```

Si el usuario no existe, la API responde `404 Not Found`.

Si el ID no tiene un formato válido de MongoDB, responde `400 Bad Request`.

## Actualizar un usuario

```http
PUT /usuarios/64f123456789abcdef123456
Content-Type: application/json
```

La actualización es parcial, por lo que solamente deben enviarse los campos que se desean modificar:

```json
{
  "nombre": "Ana Torres Actualizada",
  "edad": 26
}
```

Respuesta exitosa: `200 OK`

```json
{
  "mensaje": "Usuario actualizado correctamente",
  "data": {
    "_id": "64f123456789abcdef123456",
    "nombre": "Ana Torres Actualizada",
    "email": "ana.torres@example.com",
    "edad": 26,
    "fecha_creacion": "2026-08-06T12:00:00.000Z",
    "direcciones": []
  }
}
```

Los campos que pueden actualizarse son:

- `nombre`
- `email`
- `edad`
- `direcciones`

No está permitido modificar `_id` ni `fecha_creacion`.

## Eliminar un usuario

```http
DELETE /usuarios/64f123456789abcdef123456
```

Respuesta exitosa: `200 OK`

```json
{
  "mensaje": "Usuario eliminado correctamente"
}
```

Si el usuario no existe, responde `404 Not Found`.

## Buscar usuarios por ciudad

```http
GET /usuarios/buscar?ciudad=Lima
```

La búsqueda:

- Revisa todas las direcciones de cada usuario.
- Coincide con el nombre completo de la ciudad.
- No diferencia entre mayúsculas y minúsculas.
- Interpreta de forma segura los caracteres especiales.

Por ejemplo, `Lima`, `lima` y `LIMA` producen la misma búsqueda.

Respuesta con resultados:

```json
{
  "data": [
    {
      "_id": "64f123456789abcdef123456",
      "nombre": "Ana Torres",
      "email": "ana.torres@example.com",
      "edad": 25,
      "fecha_creacion": "2026-08-06T12:00:00.000Z",
      "direcciones": [
        {
          "calle": "Av. Principal 123",
          "ciudad": "Lima",
          "pais": "Perú",
          "codigo_postal": "00501"
        }
      ]
    }
  ],
  "total": 1
}
```

Una búsqueda válida sin resultados responde `200 OK`:

```json
{
  "data": [],
  "total": 0
}
```

Si no se envía el parámetro `ciudad`, responde `400 Bad Request`.

## Validaciones

La API valida que:

- `nombre` sea un texto no vacío.
- `email` tenga un formato válido.
- El email no esté registrado por otro usuario.
- `edad` sea un número entero igual o mayor que cero.
- `direcciones` sea un array.
- Cada dirección sea un objeto válido.
- Todos los campos de una dirección sean textos no vacíos.
- Los identificadores tengan un formato válido de MongoDB.
- Los parámetros de paginación sean enteros positivos.
- El límite de paginación no sea mayor que `100`.
- Un `PUT` contenga al menos un campo permitido.
- `_id` y `fecha_creacion` no puedan modificarse.

Ejemplo de error de validación:

```json
{
  "error": "Los datos del usuario no son válidos",
  "detalles": [
    {
      "campo": "nombre",
      "mensaje": "El nombre debe ser un texto no vacío"
    }
  ]
}
```

Ejemplo de email duplicado:

```json
{
  "error": "Ya existe un usuario con los datos proporcionados",
  "campo": "email"
}
```

Ejemplo de usuario no encontrado:

```json
{
  "error": "Usuario no encontrado"
}
```

## Códigos de respuesta

| Código | Significado                        |
| -----: | ---------------------------------- |
|  `200` | Petición procesada correctamente   |
|  `201` | Usuario creado correctamente       |
|  `400` | Datos, parámetros o JSON inválidos |
|  `404` | Usuario no encontrado              |
|  `409` | Email duplicado                    |
|  `500` | Error interno del servidor         |

## Estructura del proyecto

```text
prueba-c2lab/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── usuario.controller.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── usuario-validation.middleware.js
│   ├── models/
│   │   └── Usuario.js
│   ├── routes/
│   │   └── usuario.routes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Organización del código

- `config`: configuración y conexión con MongoDB.
- `controllers`: lógica de cada operación de la API.
- `middlewares`: validación de peticiones y manejo de errores.
- `models`: esquemas y modelos de Mongoose.
- `routes`: definición de los endpoints.
- `app.js`: configuración de Express.
- `server.js`: conexión con MongoDB e inicio del servidor.

## Scripts disponibles

| Comando       | Descripción                                 |
| ------------- | ------------------------------------------- |
| `npm run dev` | Ejecuta el servidor con reinicio automático |
| `npm start`   | Ejecuta el servidor en modo normal          |

## Pruebas manuales

Los endpoints pueden probarse utilizando Postman o Bruno.

Flujo recomendado:

1. Crear un usuario con `POST /usuarios`.
2. Copiar el `_id` recibido.
3. Listarlo con `GET /usuarios`.
4. Consultarlo con `GET /usuarios/:id`.
5. Buscarlo por ciudad con `GET /usuarios/buscar?ciudad=Lima`.
6. Actualizarlo con `PUT /usuarios/:id`.
7. Eliminarlo con `DELETE /usuarios/:id`.
8. Confirmar que responde `404` después de eliminarlo.

## Repositorio

[https://github.com/juanodsk/prueba-c2lab](https://github.com/juanodsk/prueba-c2lab)

> **Nota:** Realicé commits progresivos para mostrar el flujo de desarrollo que seguí al resolver la prueba. Muchas gracias.
