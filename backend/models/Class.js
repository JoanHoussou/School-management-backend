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
    enum: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'Tle']
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
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'transferred', 'inactive', 'graduated'],
      default: 'active'
    },
    attendance: {
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      late: { type: Number, default: 0 }
    },
    academicPerformance: {
      averageGrade: { type: Number, default: 0 },
      rank: { type: Number },
      lastUpdated: Date
    }
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
  notifications: [{
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
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

// Méthode pour ajouter un étudiant avec des données enrichies
classSchema.methods.addStudent = async function(studentId) {
  try {
    // Vérifier si l'étudiant existe déjà
    const existingStudent = this.students.find(s => s.student?.equals(studentId));
    if (existingStudent) {
      if (existingStudent.status === 'inactive') {
        existingStudent.status = 'active';
        existingStudent.enrollmentDate = new Date();
        await this.save();
        return { success: true, message: 'Étudiant réactivé', student: existingStudent };
      }
      return { success: false, message: 'Étudiant déjà inscrit' };
    }

    // Vérifier la capacité
    if (this.students.filter(s => s.status === 'active').length >= this.capacity) {
      return { success: false, message: 'Capacité maximale atteinte' };
    }

    // Ajouter l'étudiant avec les données enrichies
    const studentEntry = {
      student: studentId,
      enrollmentDate: new Date(),
      status: 'active',
      attendance: {
        present: 0,
        absent: 0,
        late: 0
      },
      academicPerformance: {
        averageGrade: 0,
        lastUpdated: new Date()
      }
    };

    this.students.push(studentEntry);
    await this.save();

    // Mettre à jour les références de l'étudiant
    await Student.findByIdAndUpdate(studentId, {
      $push: {
        classes: {
          class: this._id,
          enrollmentDate: studentEntry.enrollmentDate,
          status: 'active'
        }
      }
    });

    return { success: true, message: 'Étudiant inscrit avec succès', student: studentEntry };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
    return { success: false, message: error.message };
  }
};

// Méthode pour mettre à jour le statut d'un étudiant
classSchema.methods.updateStudentStatus = async function(studentId, newStatus) {
  const student = this.students.find(s => s.student?.equals(studentId));
  if (student) {
    student.status = newStatus;
    await this.save();
    return { success: true, message: `Statut mis à jour: ${newStatus}` };
  }
  return { success: false, message: 'Étudiant non trouvé' };
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