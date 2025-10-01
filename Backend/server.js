require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require("os");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Habilita CORS para todas as origens (para desenvolvimento)
app.use(cors());

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

const ip = getLocalIp();

// Conecta ao MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando em http://${ip}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
  });
