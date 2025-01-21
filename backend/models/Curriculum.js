const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  level: {
    type: String,
    enum: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'Tle'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  objectives: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    expectedCompetencies: [String]
  }],
  units: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // en heures
      required: true
    },
    content: [String],
    resources: [{
      type: {
        type: String,
        enum: ['document', 'video', 'exercise', 'other'],
        required: true
      },
      title: String,
      url: String,
      description: String
    }]
  }],
  evaluationCriteria: [{
    criterion: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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

// Middleware pour mettre à jour la date de modification
curriculumSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index composé pour s'assurer qu'un programme est unique pour une matière, un niveau et une année
curriculumSchema.index({ subject: 1, level: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);