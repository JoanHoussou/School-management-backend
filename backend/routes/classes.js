const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const Class = require('../models/Class');
const User = require('../models/User');

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin ou professeur
const isTeacherOrAdmin = authorizeRoles('admin', 'teacher');

// Liste toutes les classes
router.get('/', authenticateJWT, async (req, res) => {
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
router.get('/:id', authenticateJWT, async (req, res) => {
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

    // Vérifie si une classe avec le même nom existe déjà pour l'année scolaire
    const existingClass = await Class.findOne({ name, academicYear });
    if (existingClass) {
      return res.status(400).json({ message: 'Une classe avec ce nom existe déjà pour cette année scolaire' });
    }

    const newClass = new Class({
      name,
      level,
      academicYear,
      mainTeacher,
      capacity
    });

    await newClass.save();

    const populatedClass = await Class.findById(newClass._id)
      .populate('mainTeacher', 'name username');

    res.status(201).json({
      message: 'Classe créée avec succès',
      class: populatedClass
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la classe', error: error.message });
  }
});

// Modifie une classe existante (admin uniquement)
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
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
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
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

// Ajoute des étudiants à une classe
router.post('/:id/students', authenticateJWT, isTeacherOrAdmin, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const classe = await Class.findById(req.params.id);
    
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    // Vérifie si la classe a assez de capacité
    if (classe.students.length + studentIds.length > classe.capacity) {
      return res.status(400).json({ message: 'La capacité de la classe serait dépassée' });
    }

    // Vérifie si tous les IDs correspondent à des étudiants valides
    const students = await User.find({
      _id: { $in: studentIds },
      role: 'student'
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Certains IDs d\'étudiants sont invalides' });
    }

    // Ajoute les étudiants qui ne sont pas déjà dans la classe
    const newStudents = studentIds.filter(id => !classe.students.includes(id));
    classe.students.push(...newStudents);
    
    await classe.save();

    const updatedClass = await Class.findById(req.params.id)
      .populate('students', 'name username')
      .populate('mainTeacher', 'name username')
      .populate('teachers.teacher', 'name username');

    res.json({
      message: 'Étudiants ajoutés avec succès',
      class: updatedClass
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout des étudiants', error: error.message });
  }
});

module.exports = router;