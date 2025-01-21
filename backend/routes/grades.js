const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const Grade = require('../models/Grade');

// Middleware d'authentification et d'autorisation
const authMiddleware = {
  teacherOrAdmin: authorizeRoles('teacher', 'admin'),
  adminOnly: authorizeRoles('admin')
};

// Récupérer les notes d'un élève
router.get('/student/:studentId', authenticateJWT, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('subject', 'name code')
      .populate('class', 'name level')
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    res.json(grades);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
});

// Récupérer les notes d'une classe
router.get('/class/:classId', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const { subject, term } = req.query;
    const query = { class: req.params.classId };
    
    if (subject) query.subject = subject;
    if (term) query.term = term;

    const grades = await Grade.find(query)
      .populate('student', 'name')
      .populate('subject', 'name code')
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    res.json(grades);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des notes de la classe',
      error: error.message
    });
  }
});

// Statistiques de classe
router.get('/stats/class/:classId', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const { subject, term } = req.query;
    const query = { class: req.params.classId };
    
    if (subject) query.subject = subject;
    if (term) query.term = term;

    const grades = await Grade.find(query);
    
    // Calcul des statistiques
    const stats = {
      count: grades.length,
      average: 0,
      median: 0,
      highest: 0,
      lowest: 20,
      distribution: {
        '0-5': 0,
        '5-10': 0,
        '10-15': 0,
        '15-20': 0
      }
    };

    if (grades.length > 0) {
      // Moyenne
      const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
      stats.average = Math.round((sum / grades.length) * 100) / 100;

      // Médiane
      const sortedGrades = grades.map(g => g.value).sort((a, b) => a - b);
      const mid = Math.floor(sortedGrades.length / 2);
      stats.median = sortedGrades.length % 2 === 0
        ? (sortedGrades[mid - 1] + sortedGrades[mid]) / 2
        : sortedGrades[mid];

      // Min/Max
      stats.highest = Math.max(...sortedGrades);
      stats.lowest = Math.min(...sortedGrades);

      // Distribution
      grades.forEach(grade => {
        const value = grade.value;
        if (value < 5) stats.distribution['0-5']++;
        else if (value < 10) stats.distribution['5-10']++;
        else if (value < 15) stats.distribution['10-15']++;
        else stats.distribution['15-20']++;
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
});

// Ajouter une note
router.post('/', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const newGrade = new Grade({
      ...req.body,
      createdBy: req.user._id
    });

    const savedGrade = await newGrade.save();
    
    const populatedGrade = await Grade.findById(savedGrade._id)
      .populate('student', 'name')
      .populate('subject', 'name code')
      .populate('class', 'name level')
      .populate('createdBy', 'name');

    res.status(201).json(populatedGrade);
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de l\'ajout de la note',
      error: error.message
    });
  }
});

// Modifier une note
router.put('/:id', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    .populate('student', 'name')
    .populate('subject', 'name code')
    .populate('class', 'name level')
    .populate('createdBy', 'name');

    if (!updatedGrade) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    res.json(updatedGrade);
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la modification de la note',
      error: error.message
    });
  }
});

module.exports = router;