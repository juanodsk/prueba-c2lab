function formatearErrorValidacion(validationError) {
  const mensajesDeTipo = {
    direcciones: "Las direcciones deben ser un arreglo de objetos válidos",
    edad: "La edad debe ser un número válido",
  };

  if (validationError.name === "CastError") {
    return {
      campo: validationError.path,
      mensaje:
        mensajesDeTipo[validationError.path] ??
        `El campo ${validationError.path} tiene un tipo inválido`,
    };
  }

  return {
    campo: validationError.path,
    mensaje: validationError.message,
  };
}

export function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    const campoDuplicado = Object.keys(
      error.keyPattern ?? error.keyValue ?? {},
    )[0];

    return res.status(409).json({
      error: "Ya existe un usuario con los datos proporcionados",
      campo: campoDuplicado ?? "email",
    });
  }

  if (error.name === "ValidationError") {
    const detalles = Object.values(error.errors).map(formatearErrorValidacion);

    return res.status(400).json({
      error: "Los datos del usuario no son válidos",
      detalles,
    });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: "El cuerpo de la petición contiene un JSON inválido",
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Error interno del servidor",
  });
}
