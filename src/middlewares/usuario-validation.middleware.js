const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esTextoValido(value) {
  return typeof value === "string" && value.trim().length > 0;
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
    if (!Array.isArray(direcciones)) {
      detalles.push({
        campo: "direcciones",
        mensaje: "Las direcciones deben ser un arreglo",
      });
    } else {
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
  }

  if (detalles.length > 0) {
    return res.status(400).json({
      error: "Los datos del usuario no son válidos",
      detalles,
    });
  }

  next();
}
