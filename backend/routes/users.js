/* eslint-env node, commonjs */
/* eslint-disable no-undef */
const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = [
  authenticateJWT,
  authorizeRoles('admin')
];

// Récupérer tous les étudiants
router.get('/students', isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('children', 'name email');
    
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
router.get('/teachers', isAdmin, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password');
    
    res.json(teachers);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des professeurs',
      error: error.message
    });
  }
});

// Récupérer tous les parents
router.get('/parents', isAdmin, async (req, res) => {
  try {
    const parents = await User.find({ role: 'parent' })
      .select('-password')
      .populate('children', 'name email class');
    
    res.json(parents);
  } catch (error) {
    console.error('Erreur lors de la récupération des parents:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des parents',
      error: error.message
    });
  }
});

// Créer un nouvel utilisateur
router.post('/', isAdmin, async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      email,
      name,
      phone,
      isActive,
      class: className,
      subjects,
      parentEmail,
      children
    } = req.body;

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
    const userData = {
      username,
      password,
      role,
      email,
      name,
      phone,
      isActive
    };

    // Ajout des champs spécifiques selon le rôle
    if (role === 'student' && className) {
      userData.class = className;
      userData.parentEmail = parentEmail;
    }
    if (role === 'teacher' && subjects) {
      userData.subjects = subjects;
    }
    if (role === 'parent' && children) {
      userData.children = children;
    }

    const newUser = await User.create(userData);
    const userResponse = await User.findById(newUser._id)
      .select('-password')
      .populate('children', 'name email class');

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      name,
      phone,
      isActive,
      class: className,
      subjects,
      parentEmail,
      children
    } = req.body;

    const updateData = {
      username,
      email,
      name,
      phone,
      isActive
    };

    // Ajouter les champs conditionnels
    if (password) {
      updateData.password = password;
    }
    if (className) {
      updateData.class = className;
    }
    if (subjects) {
      updateData.subjects = subjects;
    }
    if (parentEmail) {
      updateData.parentEmail = parentEmail;
    }
    if (children) {
      updateData.children = children;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .select('-password')
    .populate('children', 'name email class');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message
    });
  }
});

// Supprimer un utilisateur
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Si c'est un parent, mettre à jour les références des enfants
    if (user.role === 'parent' && user.children?.length > 0) {
      await User.updateMany(
        { _id: { $in: user.children } },
        { $unset: { parentEmail: 1 } }
      );
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
});

module.exports = router;