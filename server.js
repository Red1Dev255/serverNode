const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

let val = 0;

// Initialisation de socket.io avec CORS configuré
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Stockage des choix des utilisateurs par room
const rooms = {};

// Test de la route GET '/'
app.get('/', function (req, res) {
  res.send('Le serveur est en marche');
});

io.on('connection', (socket) => {
  console.log('Nouvelle connexion');

  // Rejoindre une room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Utilisateur rejoint la room: ${room}`);

    // Envoyer l'état actuel des choix dans cette room
    if (!rooms[room]) rooms[room] = {}; // Initialisation si vide
    io.to(room).emit('updateChoices', rooms[room]);
  });

  // Quand un utilisateur choisit un numéro
  socket.on('chooseNumber', ({ room, username, number }) => {
    if (!rooms[room]) rooms[room] = {}; // Création si la room n'existe pas
    rooms[room][username] = number; // Enregistrer le choix de l'utilisateur

    console.log(`${username} a choisi ${number} dans la room ${room}`);

    // Envoyer la mise à jour à tous les membres de la room
    io.to(room).emit('updateChoices', rooms[room]);
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

// Démarrer le serveur
server.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});
