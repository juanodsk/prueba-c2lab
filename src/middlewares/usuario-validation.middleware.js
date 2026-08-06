import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esTextoValido(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validarDirecciones(direcciones, detalles) {
  if (!Array.isArray(direcciones)) {
    detalles.push({
      campo: "direcciones",
      mensaje: "Las direcciones deben ser un arreglo",
    });

    return;
  }

  direcciones.forEach((direccion, index) => {
    if (
      typeof direccion !== "object" ||
      direccion === null ||
      Array.isArray(direccion)
    ) {
      detalles.push({
        campo: `direcciones.${index}`,
        mensaje: "La dirección debe ser un objeto válido",
      });

      return;
    }

    const camposRequeridos = ["calle", "ciudad", "pais", "codigo_postal"];

    camposRequeridos.forEach((campo) => {
      if (!esTextoValido(direccion[campo])) {
        detalles.push({
          campo: `direcciones.${index}.${campo}`,
          mensaje: `El campo ${campo} debe ser un texto no vacío`,
        });
      }
    });
  });
}

export function validarCrearUsuario(req, res, next) {
  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      error: "El cuerpo de la petición debe ser un objeto JSON",
    });
  }

  const { nombre, email, edad, direcciones } = req.body;
  const detalles = [];

  if (!esTextoValido(nombre)) {
    detalles.push({
      campo: "nombre",
      mensaje: "El nombre debe ser un texto no vacío",
    });
  }

  if (!esTextoValido(email)) {
    detalles.push({
      campo: "email",
      mensaje: "El email debe ser un texto no vacío",
    });
  } else if (!emailRegex.test(email)) {
    detalles.push({
      campo: "email",
      mensaje: "El formato del email no es válido",
    });
  }

  if (
    edad !== undefined &&
    (typeof edad !== "number" || !Number.isInteger(edad) || edad < 0)
  ) {
    detalles.push({
      campo: "edad",
      mensaje: "La edad debe ser un número entero no negativo",
    });
  }

  if (direcciones !== undefined) {
    validarDirecciones(direcciones, detalles);
  }

  if (detalles.length > 0) {
    return res.status(400).json({
      error: "Los datos del usuario no son válidos",
      detalles,
    });
  }

  next();
}

function convertirEnteroPositivo(value) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const numero = Number(value);

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    return null;
  }

  return numero;
}

export function validarPaginacion(req, res, next) {
  const page = convertirEnteroPositivo(req.query.page ?? "1");
  const limit = convertirEnteroPositivo(req.query.limit ?? "10");
  const detalles = [];

  if (page === null) {
    detalles.push({
      campo: "page",
      mensaje: "page debe ser un número entero mayor que cero",
    });
  }

  if (limit === null) {
    detalles.push({
      campo: "limit",
      mensaje: "limit debe ser un número entero mayor que cero",
    });
  } else if (limit > 100) {
    detalles.push({
      campo: "limit",
      mensaje: "limit no puede ser mayor que 100",
    });
  }

  if (detalles.length > 0) {
    return res.status(400).json({
      error: "Los parámetros de paginación no son válidos",
      detalles,
    });
  }

  req.pagination = {
    page,
    limit,
  };

  next();
}

export function validarIdUsuario(req, res, next) {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      error: "El identificador del usuario no es válido",
    });
  }

  next();
}

const camposActualizables = ["nombre", "email", "edad", "direcciones"];

export function validarActualizarUsuario(req, res, next) {
  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      error: "El cuerpo de la petición debe ser un objeto JSON",
    });
  }

  const camposRecibidos = Object.keys(req.body);
  const detalles = [];

  if (camposRecibidos.length === 0) {
    detalles.push({
      campo: "body",
      mensaje: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  const camposNoPermitidos = camposRecibidos.filter(
    (campo) => !camposActualizables.includes(campo),
  );

  camposNoPermitidos.forEach((campo) => {
    detalles.push({
      campo,
      mensaje: "Este campo no puede ser actualizado",
    });
  });

  const { nombre, email, edad, direcciones } = req.body;

  if (nombre !== undefined && !esTextoValido(nombre)) {
    detalles.push({
      campo: "nombre",
      mensaje: "El nombre debe ser un texto no vacío",
    });
  }

  if (email !== undefined) {
    if (!esTextoValido(email)) {
      detalles.push({
        campo: "email",
        mensaje: "El email debe ser un texto no vacío",
      });
    } else if (!emailRegex.test(email)) {
      detalles.push({
        campo: "email",
        mensaje: "El formato del email no es válido",
      });
    }
  }

  if (
    edad !== undefined &&
    (typeof edad !== "number" || !Number.isInteger(edad) || edad < 0)
  ) {
    detalles.push({
      campo: "edad",
      mensaje: "La edad debe ser un número entero no negativo",
    });
  }

  if (direcciones !== undefined) {
    validarDirecciones(direcciones, detalles);
  }

  if (detalles.length > 0) {
    return res.status(400).json({
      error: "Los datos del usuario no son válidos",
      detalles,
    });
  }

  next();
}

export function validarBusquedaPorCiudad(req, res, next) {
  const { ciudad } = req.query;

  if (typeof ciudad !== "string" || ciudad.trim().length === 0) {
    return res.status(400).json({
      error: "El parámetro ciudad es obligatorio y debe ser un texto no vacío",
    });
  }

  next();
}
