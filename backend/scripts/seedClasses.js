require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Class = require('../models/Class');
const User = require('../models/User');
const connectDB = require('../config/database');

const createClasses = async (teachers) => {
  const classes = [
    {
      name: '6ème A',
      level: '6eme',
      academicYear: '2023-2024',
      mainTeacher: teachers[0]._id,
      capacity: 30,
      teachers: [
        { teacher: teachers[0]._id, subject: 'Mathématiques' },
        { teacher: teachers[1]._id, subject: 'Français' }
      ]
    },
    {
      name: '5ème A',
      level: '5eme',
      academicYear: '2023-2024',
      mainTeacher: teachers[1]._id,
      capacity: 28,
      teachers: [
        { teacher: teachers[1]._id, subject: 'Français' },
        { teacher: teachers[2]._id, subject: 'Histoire-Géo' }
      ]
    },
    {
      name: '4ème A',
      level: '4eme',
      academicYear: '2023-2024',
      mainTeacher: teachers[2]._id,
      capacity: 25,
      teachers: [
        { teacher: teachers[2]._id, subject: 'Histoire-Géo' },
        { teacher: teachers[0]._id, subject: 'Mathématiques' }
      ]
    },
    {
      name: '3ème A',
      level: '3eme',
      academicYear: '2023-2024',
      mainTeacher: teachers[0]._id,
      capacity: 32,
      teachers: [
        { teacher: teachers[0]._id, subject: 'Mathématiques' },
        { teacher: teachers[1]._id, subject: 'Français' },
        { teacher: teachers[2]._id, subject: 'Histoire-Géo' }
      ]
    }
  ];

  return await Class.create(classes);
};

const seedClasses = async () => {
  try {
    await connectDB();
    
    // Récupère les professeurs existants
    const teachers = await User.find({ role: 'teacher' });
    if (teachers.length < 3) {
      throw new Error('Pas assez de professeurs dans la base de données. Exécutez d\'abord seedUsers.js');
    }

    // Supprime les classes existantes
    await Class.deleteMany({});
    console.log('Base de données nettoyée');

    // Crée les nouvelles classes
    const createdClasses = await createClasses(teachers);
    console.log(`${createdClasses.length} classes créées`);

    // Ferme la connexion
    await mongoose.connection.close();
    console.log('Connexion à la base de données fermée');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    process.exit(1);
  }
};

seedClasses();