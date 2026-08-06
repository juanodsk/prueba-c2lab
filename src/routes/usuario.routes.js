import { Router } from "express";
import { crearUsuario } from "../controllers/usuario.controller.js";
import { validarCrearUsuario } from "../middlewares/usuario-validation.middleware.js";

const router = Router();

router.post("/", validarCrearUsuario, crearUsuario);

export default router;
