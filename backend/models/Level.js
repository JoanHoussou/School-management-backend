const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Méthode pour formater le niveau pour l'affichage
levelSchema.methods.toJSON = function() {
  const level = this.toObject();
  return {
    _id: level._id,
    name: level.name,
    displayName: level.displayName,
    order: level.order,
    isActive: level.isActive
  };
};

const Level = mongoose.model('Level', levelSchema);

module.exports = Level; 