const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { configureSocket } = require('./config/socket');
const viewsRouter = require('./routes/views.router');

const app = express();
const server = http.createServer(app);

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', viewsRouter);

// Configurar WebSockets
configureSocket(server);

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});