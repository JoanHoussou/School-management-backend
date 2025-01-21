const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  coefficient: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 10
  },
  type: {
    type: String,
    required: true,
    enum: ['devoir', 'examen', 'projet', 'participation', 'autre']
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  term: {
    type: String,
    required: true,
    enum: ['T1', 'T2', 'T3']
  },
  academicYear: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
gradeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index composés
gradeSchema.index({ student: 1, subject: 1, term: 1, academicYear: 1 });
gradeSchema.index({ class: 1, subject: 1, term: 1 });

module.exports = mongoose.model('Grade', gradeSchema);