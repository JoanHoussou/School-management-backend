const mongoose = require('mongoose');
require('dotenv').config();
const Level = require('../models/Level');

// Configuration de la connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

const levels = [
  {
    name: '6eme',
    displayName: '6ème',
    order: 1
  },
  {
    name: '5eme',
    displayName: '5ème',
    order: 2
  },
  {
    name: '4eme',
    displayName: '4ème',
    order: 3
  },
  {
    name: '3eme',
    displayName: '3ème',
    order: 4
  }
];

async function seedLevels() {
  try {
    // Supprime tous les niveaux existants
    await Level.deleteMany({});

    // Insère les nouveaux niveaux
    const insertedLevels = await Level.insertMany(levels);
    console.log('Niveaux créés avec succès:', insertedLevels);

    // Ferme la connexion à la base de données
    await mongoose.connection.close();
    console.log('Connexion à la base de données fermée');
  } catch (error) {
    console.error('Erreur lors de la création des niveaux:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedLevels();