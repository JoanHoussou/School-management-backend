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

module.exports = router;