const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  grades: [{
    subject: String,
    value: Number,
    date: Date,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present'
    },
    reason: String
  }]
});

// Héritage du modèle User
const Student = User.discriminator('Student', studentSchema);

module.exports = Student;