const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// GET /api/assignments - Récupérer tous les devoirs
router.get('/', authenticateJWT, async (req, res) => {
  try {
    let assignments;
    if (req.user.role === 'teacher') {
      // Les professeurs voient leurs propres devoirs
      assignments = await Assignment.find({ teacherId: req.user._id });
    } else if (req.user.role === 'student') {
      // Les élèves voient les devoirs de leur classe
      assignments = await Assignment.find({ class: req.user.class });
    }
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/assignments - Créer un devoir
router.post('/', authenticateJWT, authorizeRoles('teacher'), async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      teacherId: req.user._id
    });
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/assignments/:id - Modifier un devoir
router.put('/:id', authenticateJWT, authorizeRoles('teacher'), async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ 
      _id: req.params.id,
      teacherId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }

    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/assignments/:id - Supprimer un devoir
router.delete('/:id', authenticateJWT, authorizeRoles('teacher'), async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ 
      _id: req.params.id,
      teacherId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }

    res.json({ message: 'Devoir supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/assignments/:id/submit - Soumettre un devoir
router.post('/:id/submit', authenticateJWT, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Seuls les élèves peuvent soumettre des devoirs' });
    }

    // Vérifier si l'élève est dans la bonne classe
    if (assignment.class !== req.user.class) {
      return res.status(403).json({ message: 'Ce devoir ne fait pas partie de votre classe' });
    }

    // Vérifier si l'élève a déjà soumis
    const existingSubmission = assignment.submissions.find(
      s => s.studentId.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Vous avez déjà soumis ce devoir' });
    }

    assignment.submissions.push({
      studentId: req.user._id,
      studentName: req.user.name,
      content: req.body.content,
      attachments: req.body.attachments || []
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/assignments/:id/grade - Noter un devoir
router.put('/:id/grade', authenticateJWT, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { submissionId, grade, feedback } = req.body;
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      teacherId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;