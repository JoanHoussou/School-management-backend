require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const userRoutes = require('./routes/users');
const academicRoutes = require('./routes/academic');
const assignmentRoutes = require('./routes/assignments');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL du frontend Vite.js
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialisation de Passport
require('./config/passport');
app.use(passport.initialize());

// Configuration des routes
const gradeRoutes = require('./routes/grades');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/users', userRoutes);
app.use('/api', academicRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/assignments', assignmentRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API du système de gestion scolaire' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue !',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée :', err);
});