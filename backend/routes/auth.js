const express = require('express');
const passport = require('passport');
const { generateToken } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role, name } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' 
      });
    }

    // Création du nouvel utilisateur
    const user = new User({
      username,
      password, // Sera hashé par le middleware mongoose
      email,
      role,
      name
    });

    await user.save();

    // Génération du token JWT
    const token = generateToken(user);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription', 
      error: error.message 
    });
  }
});

// Route de connexion
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Erreur lors de la connexion',
        error: err.message 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        message: info.message || 'Identifiants invalides' 
      });
    }

    // Génération du token JWT
    const token = generateToken(user);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      },
      token
    });
  })(req, res, next);
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  // Comme nous utilisons JWT, pas besoin de gérer une session
  res.json({ message: 'Déconnexion réussie' });
});

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/profile', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        lastLogin: req.user.lastLogin
      }
    });
  }
);

module.exports = router;