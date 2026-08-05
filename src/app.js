import express from "express";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de usuarios funcionando",
  });
});

export default app;
