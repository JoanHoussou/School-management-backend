const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: function() { return !this.teacherId; }
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return !this.classId; }
  },
  subject: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
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
  room: {
    type: String,
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

// Middleware pour mettre à jour updatedAt avant la sauvegarde
scheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware pour vérifier qu'il n'y a pas de conflit d'horaire
scheduleSchema.pre('save', async function(next) {
  if (this.isModified('startTime') || this.isModified('endTime') || this.isModified('dayOfWeek')) {
    const conflictQuery = {
      dayOfWeek: this.dayOfWeek,
      $or: [
        {
          startTime: { $lt: this.endTime },
          endTime: { $gt: this.startTime }
        }
      ],
      _id: { $ne: this._id }
    };

    if (this.teacherId) {
      conflictQuery.teacherId = this.teacherId;
    }
    if (this.classId) {
      conflictQuery.classId = this.classId;
    }

    const conflict = await this.constructor.findOne(conflictQuery);
    if (conflict) {
      next(new Error('Conflit d\'horaire détecté'));
    }
  }
  next();
});

// Index pour optimiser les recherches
scheduleSchema.index({ teacherId: 1, dayOfWeek: 1 });
scheduleSchema.index({ classId: 1, dayOfWeek: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);