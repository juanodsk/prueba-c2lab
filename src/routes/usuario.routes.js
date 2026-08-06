import { Router } from "express";
import {
  crearUsuario,
  listarUsuarios,
} from "../controllers/usuario.controller.js";
import {
  validarCrearUsuario,
  validarPaginacion,
} from "../middlewares/usuario-validation.middleware.js";

const router = Router();

router.get("/", validarPaginacion, listarUsuarios);
router.post("/", validarCrearUsuario, crearUsuario);

export default router;
