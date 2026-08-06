import { Router } from "express";
import {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuario.controller.js";

import {
  validarCrearUsuario,
  validarIdUsuario,
  validarPaginacion,
  validarActualizarUsuario,
} from "../middlewares/usuario-validation.middleware.js";

const router = Router();

router.get("/", validarPaginacion, listarUsuarios);
router.post("/", validarCrearUsuario, crearUsuario);
router.get("/:id", validarIdUsuario, obtenerUsuarioPorId);
router.put(
  "/:id",
  validarIdUsuario,
  validarActualizarUsuario,
  actualizarUsuario,
);
router.delete("/:id", validarIdUsuario, eliminarUsuario);
export default router;
