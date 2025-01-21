const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
  // Informations académiques
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  classes: [{
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'transferred'],
      default: 'active'
    }
  }],
  currentGradeLevel: {
    type: String,
    enum: ['6eme', '5eme', '4eme', '3eme'],
    required: true
  },
  // Informations personnelles
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['M', 'F', 'Other']
  },
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  // Relations
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Suivi académique
  grades: [{
    subject: String,
    value: Number,
    date: Date,
    semester: {
      type: String,
      enum: ['S1', 'S2']
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: String
  }],
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present'
    },
    reason: String,
    justification: {
      provided: {
        type: Boolean,
        default: false
      },
      document: String,
      notes: String
    }
  }],
  // Suivi comportemental
  disciplinaryRecords: [{
    date: Date,
    type: {
      type: String,
      enum: ['warning', 'detention', 'suspension']
    },
    reason: String,
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolution: String
  }]
});

// Héritage du modèle User
const Student = User.discriminator('Student', studentSchema);

module.exports = Student;