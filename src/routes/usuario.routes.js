import { Router } from "express";
import {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
} from "../controllers/usuario.controller.js";

import {
  validarCrearUsuario,
  validarIdUsuario,
  validarPaginacion,
} from "../middlewares/usuario-validation.middleware.js";

const router = Router();

router.get("/", validarPaginacion, listarUsuarios);
router.post("/", validarCrearUsuario, crearUsuario);
router.get("/:id", validarIdUsuario, obtenerUsuarioPorId);

export default router;
