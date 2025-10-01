const express = require('express');
const cors = require('cors');
const app = express();
const errorResponse = require('./utils/errorResponse');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(errorResponse);

// Servir arquivos estáticos (imagens de avatar)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/habtracker/habits', require('./routes/habit.routes'));
app.use('/habtracker/users', require('./routes/users.routes'));
app.use('/habtracker/admin', require('./routes/admin.routes'));
app.use('/habtracker/achievements', require('./routes/achievement.routes'));

// Middleware para erros
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON payload! Check if your body data is a valid JSON." });
  }
  res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
