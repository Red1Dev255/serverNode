const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

let val = 0;

// Initialisation de socket.io avec CORS configuré
const io = socketIo(server, {
  cors: {
    origin: "*",  // Assurez-vous que le client Vue.js est bien à cette adresse
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Test de la route GET '/'
app.get('/', function (req, res) {
  res.send('Les serveur est en marche');
});

// Exemple de socket.io sur votre serveur
io.on('connection', (socket) => {
  console.log('Nouvelle connexion');

  // Exemple de gestion de message
  socket.on('message', (data) => {
    console.log('Message reçu du client:', data);
    socket.emit('message', `je suis le serveur, message` + getValeur() +`  : ${data}`);
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


const getValeur = ()=>{
  return val === 10 ? val = 0 : val++;
}