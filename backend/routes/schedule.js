const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// GET /api/schedule/class/:classId - Emploi du temps d'une classe
router.get('/class/:classId', authenticateJWT, async (req, res) => {
  try {
    const schedule = await Schedule.find({ classId: req.params.classId })
      .populate('teacherId', 'name email')
      .sort({ dayOfWeek: 1, startTime: 1 });
    res.json(schedule);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps de la classe:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/schedule/teacher/:teacherId - Emploi du temps d'un professeur
router.get('/teacher/:teacherId', authenticateJWT, async (req, res) => {
  try {
    const schedule = await Schedule.find({ teacherId: req.params.teacherId })
      .populate('classId', 'name grade')
      .sort({ dayOfWeek: 1, startTime: 1 });
    res.json(schedule);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps du professeur:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/schedule - Ajouter un créneau
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    if (error.message === 'Conflit d\'horaire détecté') {
      res.status(400).json({ message: error.message });
    } else {
      console.error('Erreur lors de l\'ajout du créneau:', error);
      res.status(500).json({ message: error.message });
    }
  }
});

// PUT /api/schedule/:id - Modifier un créneau
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Créneau non trouvé' });
    }

    Object.assign(schedule, req.body);
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    if (error.message === 'Conflit d\'horaire détecté') {
      res.status(400).json({ message: error.message });
    } else {
      console.error('Erreur lors de la modification du créneau:', error);
      res.status(500).json({ message: error.message });
    }
  }
});

// DELETE /api/schedule/:id - Supprimer un créneau
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Créneau non trouvé' });
    }
    res.json({ message: 'Créneau supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du créneau:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;