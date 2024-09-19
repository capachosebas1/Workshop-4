require('dotenv').config();
const app = require('./src/app');
const { connectToDatabase } = require('./src/db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

startServer();
