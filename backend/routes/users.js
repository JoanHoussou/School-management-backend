const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

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