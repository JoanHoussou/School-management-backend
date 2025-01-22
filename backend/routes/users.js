/* eslint-env node, commonjs */
const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// Récupérer tous les étudiants
router.get('/students', authenticateJWT, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('_id name username email');
    
    res.json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des étudiants',
      error: error.message
    });
  }
});

// Récupérer tous les professeurs
router.get('/teachers', authenticateJWT, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('_id name username email');
    
    res.json(teachers);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des professeurs',
      error: error.message
    });
  }
});

// Créer un nouvel utilisateur
router.post('/', [authenticateJWT, (req, res, next) => {
  console.log('User making request:', req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Seuls les administrateurs peuvent créer des utilisateurs' });
  }
  next();
}], async (req, res) => {
  try {
    console.log('Headers:', req.headers);
    console.log('Attempting to create user:', req.body);
    const {
      username,
      password,
      role,
      email,
      name,
      phone,
      isActive
    } = req.body;

    console.log('Extracted user data:', { username, role, email, name, isActive });
    // Validation des champs requis
    if (!username || !password || !role || !email || !name) {
      return res.status(400).json({
        message: 'Tous les champs requis doivent être remplis'
      });
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà'
      });
    }

    // Création du nouvel utilisateur
    const newUser = await User.create({
      username,
      password, // Le modèle User hashera automatiquement le mot de passe
      role,
      email,
      name,
      phone,
      isActive
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser._id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
});

module.exports = router;