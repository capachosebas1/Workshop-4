const { MongoClient } = require('mongodb');

let db;

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas');
    db = client.db('anonimizador'); // Nombre de tu base de datos
    return db;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDatabase, getDb };
