const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const Class = require('../models/Class');
const User = require('../models/User');

const router = express.Router();

// Middleware d'autorisation utilisé dans les routes
const authMiddleware = {
  teacherOrAdmin: authorizeRoles('admin', 'teacher'),
  adminOnly: authorizeRoles('admin')
};

// Liste toutes les classes
router.get('/', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('mainTeacher', 'name username')
      .populate('students', 'name username')
      .populate('teachers.teacher', 'name username');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des classes', error: error.message });
  }
});

// Récupère une classe spécifique
router.get('/:id', authenticateJWT, authMiddleware.teacherOrAdmin, async (req, res) => {
  try {
    const classe = await Class.findById(req.params.id)
      .populate('mainTeacher', 'name username')
      .populate('students', 'name username')
      .populate('teachers.teacher', 'name username');
    
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }
    
    res.json(classe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la classe', error: error.message });
  }
});

// Crée une nouvelle classe (admin uniquement)
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('Données reçues:', req.body);
    const { name, level, academicYear, mainTeacher, capacity } = req.body;

    // Vérifie si toutes les données requises sont présentes
    if (!name || !level || !mainTeacher || !capacity) {
      return res.status(400).json({
        message: 'Données manquantes',
        required: {
          name: !name,
          level: !level,
          mainTeacher: !mainTeacher,
          capacity: !capacity
        }
      });
    }

    // Vérifie si la capacité est un nombre valide
    if (isNaN(capacity) || capacity < 1 || capacity > 40) {
      return res.status(400).json({ message: 'La capacité doit être un nombre entre 1 et 40' });
    }

    // Vérifie si le professeur principal existe et est un professeur
    const teacher = await User.findById(mainTeacher);
    console.log('Professeur trouvé:', teacher);
    
    if (!teacher) {
      return res.status(400).json({ message: 'Professeur non trouvé' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'L\'utilisateur sélectionné n\'est pas un professeur' });
    }

    // Crée et sauvegarde la nouvelle classe
    // Vérifie si une classe avec ce nom existe déjà pour cette année
    const existingClassCheck = await Class.findOne({
      name: name.trim(),
      academicYear: academicYear || '2023-2024'
    });
    
    if (existingClassCheck) {
      return res.status(400).json({
        message: 'Une classe avec ce nom existe déjà pour cette année scolaire'
      });
    }

    // Vérifie que le professeur existe
    const mainTeacherUser = await User.findById(mainTeacher);
    if (!mainTeacherUser || mainTeacherUser.role !== 'teacher') {
      return res.status(400).json({
        message: 'Le professeur principal spécifié est invalide'
      });
    }

    // Crée la nouvelle classe
    const classToCreate = new Class({
      name: name.trim(),
      level,
      academicYear: academicYear || '2023-2024',
      mainTeacher: mainTeacher,
      capacity: parseInt(capacity, 10),
      students: [],
      teachers: []
    });

    // Valide manuellement avant de sauvegarder
    const validationError = classToCreate.validateSync();
    if (validationError) {
      const errors = {};
      Object.keys(validationError.errors).forEach(key => {
        errors[key] = validationError.errors[key].message;
      });
      return res.status(400).json({
        message: 'Erreur de validation',
        errors
      });
    }

    try {
      const createdClass = await classToCreate.save();
      console.log('Classe créée avec succès:', createdClass);
      return res.status(201).json(createdClass);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return res.status(500).json({
        message: 'Erreur serveur lors de la création de la classe',
        error: error.message
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la classe', error: error.message });
  }
});

// Modifie une classe existante (admin uniquement)
router.put('/:id', authenticateJWT, authMiddleware.adminOnly, async (req, res) => {
  try {
    const { name, level, mainTeacher, capacity } = req.body;
    const classId = req.params.id;

    const classe = await Class.findById(classId);
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    if (mainTeacher) {
      const teacher = await User.findById(mainTeacher);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(400).json({ message: 'Professeur principal invalide' });
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { 
        name, 
        level, 
        mainTeacher, 
        capacity,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('mainTeacher', 'name username')
     .populate('students', 'name username')
     .populate('teachers.teacher', 'name username');

    res.json({
      message: 'Classe mise à jour avec succès',
      class: updatedClass
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la classe', error: error.message });
  }
});

// Supprime une classe (admin uniquement)
router.delete('/:id', authenticateJWT, authMiddleware.adminOnly, async (req, res) => {
  try {
    const classe = await Class.findById(req.params.id);
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    await Class.deleteOne({ _id: req.params.id });
    res.json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la classe', error: error.message });
  }
});

// Inscription d'étudiants dans une classe
router.post('/:id/students', authenticateJWT, authMiddleware.adminOnly, async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        message: 'Format de données invalide. studentIds doit être un tableau.',
        received: req.body
      });
    }

    const classe = await Class.findById(req.params.id)
      .populate({
        path: 'students.student',
        select: 'name username currentGradeLevel'
      })
      .populate('mainTeacher', 'name');

    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    // Traitement en série des inscriptions
    const results = [];
    for (const studentId of studentIds) {
      try {
        const result = await classe.addStudent(studentId);
        results.push({
          studentId,
          ...result
        });
      } catch (error) {
        results.push({
          studentId,
          success: false,
          message: error.message
        });
      }
    }

    // Rechargement des données mises à jour
    const updatedClass = await Class.findById(req.params.id)
      .populate({
        path: 'students.student',
        select: 'name username currentGradeLevel'
      })
      .populate('mainTeacher', 'name');

    // Préparation de la réponse détaillée
    const response = {
      message: 'Traitement des inscriptions terminé',
      results,
      classStatus: {
        name: updatedClass.name,
        activeStudents: updatedClass.students.filter(s => s.status === 'active').length,
        capacity: updatedClass.capacity,
        remainingSpots: updatedClass.capacity - updatedClass.students.filter(s => s.status === 'active').length
      },
      details: results.filter(r => !r.success).map(r => r.message)
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors des inscriptions:', error);
    res.status(500).json({
      message: 'Erreur lors du traitement des inscriptions',
      error: error.message
    });
  }
});
module.exports = router;