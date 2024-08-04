import pkg from "pg";
import bcrypt from "bcryptjs";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "softjobs",
  port: 8888,
  allowExitOnIdle: true,
});



const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {rows: [usuario],rowCount, } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
};

const agregarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  password = passwordEncriptada;
  const values = [email, password, rol, lenguage];
  const consulta = "INSERT INTO usuarios values (DEFAULT,$1,$2,$3,$4)";
  const result = await pool.query(consulta, values);
  console.log("Usuario creado");
};

const obtenerDatosUsuario = async (email) => {
    const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email = $1";
    const values = [email];
    try {
      const result = await pool.query(consulta, values);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw { code: 404, message: "Usuario no encontrado" };
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      throw error;
    }
  };

export {  verificarCredenciales, agregarUsuario,obtenerDatosUsuario };
