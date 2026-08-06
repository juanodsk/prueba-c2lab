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

export async function listarUsuarios(req, res, next) {
  try {
    const { page, limit } = req.pagination;
    const skip = (page - 1) * limit;

    const [usuarios, totalUsuarios] = await Promise.all([
      Usuario.find()
        .sort({ fecha_creacion: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Usuario.countDocuments(),
    ]);

    const totalPaginas = Math.ceil(totalUsuarios / limit);

    res.status(200).json({
      data: usuarios,
      paginacion: {
        paginaActual: page,
        limite: limit,
        totalUsuarios,
        totalPaginas,
        tienePaginaAnterior: page > 1,
        tienePaginaSiguiente: page < totalPaginas,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function obtenerUsuarioPorId(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.params.id).lean();

    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}
