const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Curriculum = require('../models/Curriculum');
const { authenticateJWT } = require('../middlewares/auth');
const levelController = require('../controllers/levelController');

// Middleware pour gérer les erreurs
const handleError = (res, error) => {
  console.error('Erreur:', error);
  res.status(500).json({ 
    message: error.message || 'Une erreur est survenue', 
    error: error 
  });
};

// Liste des matières
router.get('/subjects', authenticateJWT, (req, res) => {
  Subject.find()
    .populate('teachers', 'name email')
    .then(subjects => {
      res.json(subjects);
    })
    .catch(error => handleError(res, error));
});

// Créer une matière
router.post('/subjects', authenticateJWT, (req, res) => {
  const newSubject = new Subject(req.body);
  newSubject.save()
    .then(subject => {
      res.status(201).json(subject);
    })
    .catch(error => {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Cette matière existe déjà' });
      } else {
        handleError(res, error);
      }
    });
});

// Modifier une matière
router.put('/subjects/:id', authenticateJWT, (req, res) => {
  Subject.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .then(updatedSubject => {
      if (!updatedSubject) {
        return res.status(404).json({ message: 'Matière non trouvée' });
      }
      res.json(updatedSubject);
    })
    .catch(error => handleError(res, error));
});

// Liste du programme scolaire
router.get('/curriculum', authenticateJWT, (req, res) => {
  const { subject, level, academicYear } = req.query;
  const query = {};
  
  if (subject) query.subject = subject;
  if (level) query.level = level;
  if (academicYear) query.academicYear = academicYear;

  Curriculum.find(query)
    .populate('subject', 'name code')
    .populate('createdBy', 'name email')
    .then(curriculum => {
      res.json(curriculum);
    })
    .catch(error => handleError(res, error));
});

// Créer un élément du programme
router.post('/curriculum', authenticateJWT, (req, res) => {
  const newCurriculum = new Curriculum({
    ...req.body,
    createdBy: req.user._id
  });

  newCurriculum.save()
    .then(curriculum => {
      res.status(201).json(curriculum);
    })
    .catch(error => {
      if (error.code === 11000) {
        res.status(400).json({ 
          message: 'Un programme existe déjà pour cette matière, ce niveau et cette année académique' 
        });
      } else {
        handleError(res, error);
      }
    });
});

// Modifier le programme
// Supprimer une matière
router.delete('/subjects/:id', authenticateJWT, (req, res) => {
  Subject.findByIdAndDelete(req.params.id)
    .then(deletedSubject => {
      if (!deletedSubject) {
        return res.status(404).json({ message: 'Matière non trouvée' });
      }
      res.json({ message: 'Matière supprimée avec succès' });
    })
    .catch(error => handleError(res, error));
});

// Supprimer un programme
router.delete('/curriculum/:id', authenticateJWT, (req, res) => {
  Curriculum.findByIdAndDelete(req.params.id)
    .then(deletedCurriculum => {
      if (!deletedCurriculum) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }
      res.json({ message: 'Programme supprimé avec succès' });
    })
    .catch(error => handleError(res, error));
});

router.put('/curriculum/:id', authenticateJWT, (req, res) => {
  Curriculum.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .then(updatedCurriculum => {
      if (!updatedCurriculum) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }
      res.json(updatedCurriculum);
    })
    .catch(error => handleError(res, error));
});

// Routes pour les niveaux
router.get('/levels', authenticateJWT, levelController.getLevels);
router.post('/levels', authenticateJWT, levelController.createLevel);
router.put('/levels/:id', authenticateJWT, levelController.updateLevel);
router.delete('/levels/:id', authenticateJWT, levelController.deleteLevel);

module.exports = router;