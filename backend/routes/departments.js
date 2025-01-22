const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const auth = require('../middlewares/auth');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth.authenticateJWT, async (req, res) => {
  try {
    const departments = await Department.find().populate('subjects');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/departments/:id
// @desc    Get single department
// @access  Private
router.get('/:id', auth.authenticateJWT, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('subjects');
    if (!department) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/departments
// @desc    Create a department
// @access  Private/Admin
router.post('/', auth.authenticateJWT, auth.authorizeRoles('admin'), async (req, res) => {
  try {
    const department = new Department({
      name: req.body.name,
      description: req.body.description,
      color: req.body.color
    });

    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private/Admin
router.put('/:id', auth.authenticateJWT, auth.authorizeRoles('admin'), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        subjects: req.body.subjects
      },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    res.json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private/Admin
router.delete('/:id', auth.authenticateJWT, auth.authorizeRoles('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    await department.deleteOne();
    res.json({ message: 'Département supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;