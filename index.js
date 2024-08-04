import express, { json } from "express";
const app = express();
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  agregarUsuario,
  verificarCredenciales,
  obtenerDatosUsuario,
} from "./consultas.js";

const port = process.env.PORT || 3000;
app.listen(port, console.log("Server Soft Jobs ON"));
app.use(cors());
app.use(json());

app.get("/", async (req, res) => {
  const  htmlResponse = `
  <html>
  <body>
  <h1>SOy un proyecto back </body>
  </body>
  </html>
  `;
  res.send(htmlResponse)
  res.send({ message: "Hola mundo" });
});

app.get("/usuarios", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "az_AZ");
    const email = decoded.email;
    const user = await obtenerDatosUsuario(email);

    if (!user) {
      throw { code: 404, message: "Usuario no encontrado" };
    }
    res.json([user]);
  } catch (error) {
    console.log(`Error al obtener los datos del usuario`);
    res.status(error.code || 500).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await agregarUsuario(usuario);
    res.send("Usuario creado con exito");
  } catch (error) {
    res.status(500).send(error);
  }
});
