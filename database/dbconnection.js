/**
 * Para ejecutar este módulo, crear un archivo con el nombre ".env"
 * Agregar una línea con la variable
 *          EXAMPLE_MONGODB_CONNSTRING=cadenaConexionMongoDB
 */

// Requiere el módulo dotenv para cargar variables de entorno
require("dotenv").config();

// Conecta a la base de datos a través de Mongoose (https://mongoosejs.com/)
const mongoDB = require("mongoose");

const dbConnString = process.env.EXAMPLE_MONGODB_CONNSTRING;
const dbName = process.env.EXAMPLE_MONGODB_DBNAME;

// Opciones para la conexión a la base de datos
// https://mongoosejs.com/docs/connections.html#connection-string-options
const dbOptions = {
  dbName, // Nombre de la base de datos
  autoIndex: false, // Don't build indexes
  maxPoolSize: 2, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 secs
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

// Abre la conexión a la base de datos on mongoClient
mongoDB
  .connect(dbConnString, dbOptions)
  .catch((err) => {
    console.log("error codeName: ", err.codeName);
  });

/**
 * Callback de conexión exitosa
 */
function callbackConexionExitosa() {
  console.log(
    `Se estableció conexión exitosa con la base de datos ${dbName}`,
  );
}

/**
 * Callback cuando hay error en la conexión
 * @param {*} err
 */
function callbackErrorConexion(err) {
  console.log(`Error en la conexión con la base de datos: ${err.message}`);
}

/**
 * Callback cuando hay desconexión
 */
function callbackConexionDesconectada() {
  console.log("Hubo una desconexión con la base de datos");
}

/**
 * Callback para cerrar la conexión
 */
function callbackCerrarConexion() {
  console.log("Conexión terminada desde la aplicación");
  process.exit(0);
}
/**
 * Callback cuando la conexión se termina
 */
function callbackConexionTerminada() {
  mongoDB.connection.close(callbackCerrarConexion);
}

/*
 * EVENTOS DE CONEXIÓN
 */

// Cuando se conecta exitosamente
mongoDB.connection.on("connected", callbackConexionExitosa);

// Cuando la conexión genera un error
mongoDB.connection.on("error", callbackErrorConexion);

// Cuando la conexión es desconectada
mongoDB.connection.on("disconnected", callbackConexionDesconectada);

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", callbackConexionTerminada);

// Exporta la función conectar
module.exports = mongoDB;
