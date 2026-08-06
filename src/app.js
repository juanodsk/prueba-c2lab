import express from "express";
import usuarioRoutes from "./routes/usuario.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de usuarios funcionando",
  });
});

app.use("/usuarios", usuarioRoutes);

app.use(errorHandler);

export default app;
