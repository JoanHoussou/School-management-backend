const mongoose = require('mongoose');
const Student = require('./Student');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'Tle']
  },
  academicYear: {
    type: String,
    required: true
  },
  mainTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teachers: [{
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    subject: {
      type: String,
      required: true
    }
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  capacity: {
    type: Number,
    required: true,
    default: 30
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: String,
      required: true
    }
  }],
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
classSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthode pour vérifier si la classe est pleine
classSchema.methods.isFull = function() {
  return this.students.length >= this.capacity;
};

// Méthode pour ajouter un étudiant
classSchema.methods.addStudent = function(studentId) {
  if (!this.isFull() && !this.students.includes(studentId)) {
    this.students.push(studentId);
    return true;
  }
  return false;
};

// Méthode pour retirer un étudiant
classSchema.methods.removeStudent = async function(studentId) {
  const index = this.students.indexOf(studentId);
  if (index > -1) {
    this.students.splice(index, 1);
    
    // Met à jour les classes de l'étudiant
    await Student.findByIdAndUpdate(
      studentId,
      { $pull: { classes: this._id } }
    );
    
    return true;
  }
  return false;
};

// Méthode pour ajouter un professeur
classSchema.methods.addTeacher = function(teacherId, subject) {
  if (!this.teachers.some(t => t.teacher.equals(teacherId) && t.subject === subject)) {
    this.teachers.push({ teacher: teacherId, subject });
    return true;
  }
  return false;
};

// Index composé pour s'assurer qu'une classe est unique pour une année donnée
classSchema.index({ name: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);