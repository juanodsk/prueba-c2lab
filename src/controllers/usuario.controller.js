import Usuario from "../models/Usuario.js";

export async function crearUsuario(req, res, next) {
  try {
    const usuario = await Usuario.create(req.body);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}
