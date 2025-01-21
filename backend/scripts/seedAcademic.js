require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');
const connectDB = require('../config/database');

const createSubjects = async (teachers) => {
  const subjects = [
    {
      name: 'Mathématiques',
      code: 'MATH',
      description: 'Étude des nombres, des formes et des structures',
      hoursPerWeek: 4,
      levels: ['6eme', '5eme', '4eme', '3eme'],
      teachers: [teachers[0]._id],  // Premier professeur trouvé
      isOptional: false
    },
    {
      name: 'Français',
      code: 'FR',
      description: 'Étude de la langue et de la littérature française',
      hoursPerWeek: 4,
      levels: ['6eme', '5eme', '4eme', '3eme'],
      teachers: [teachers[1]._id],  // Deuxième professeur trouvé
      isOptional: false
    },
    {
      name: 'Histoire-Géographie',
      code: 'HIST-GEO',
      description: 'Étude de l\'histoire et de la géographie',
      hoursPerWeek: 3,
      levels: ['6eme', '5eme', '4eme', '3eme'],
      teachers: [teachers[2]._id],  // Troisième professeur trouvé
      isOptional: false
    }
  ];

  return await Subject.create(subjects);
};

const createCurriculum = async (subjects, admin) => {
  const curriculum = [
    {
      subject: subjects[0]._id,  // Mathématiques
      level: '6eme',
      academicYear: '2023-2024',
      objectives: [
        {
          title: 'Nombres et calculs',
          description: 'Maîtrise des opérations sur les nombres entiers et décimaux',
          expectedCompetencies: [
            'Effectuer des calculs avec des nombres décimaux',
            'Utiliser les propriétés des opérations'
          ]
        }
      ],
      units: [
        {
          title: 'Opérations sur les nombres',
          description: 'Étude des quatre opérations de base',
          duration: 20,
          content: [
            'Addition et soustraction',
            'Multiplication et division'
          ],
          resources: [
            {
              type: 'document',
              title: 'Exercices de calcul',
              description: 'Série d\'exercices sur les opérations de base'
            }
          ]
        }
      ],
      evaluationCriteria: [
        {
          criterion: 'Maîtrise des calculs',
          weight: 40
        }
      ],
      createdBy: admin._id,
      status: 'published'
    }
  ];

  return await Curriculum.create(curriculum);
};

const seedAcademic = async () => {
  try {
    await connectDB();
    
    // Récupère les professeurs et un admin
    const teachers = await User.find({ role: 'teacher' });
    const admin = await User.findOne({ role: 'admin' });

    if (teachers.length < 3) {
      throw new Error('Pas assez de professeurs dans la base de données. Exécutez d\'abord seedUsers.js');
    }

    if (!admin) {
      throw new Error('Aucun administrateur trouvé. Exécutez d\'abord seedUsers.js');
    }

    // Supprime les données existantes
    await Subject.deleteMany({});
    await Curriculum.deleteMany({});
    console.log('Base de données nettoyée');

    // Crée les nouvelles matières
    const subjects = await createSubjects(teachers);
    console.log(`${subjects.length} matières créées`);

    // Crée les nouveaux programmes
    const curriculums = await createCurriculum(subjects, admin);
    console.log(`${curriculums.length} programmes créés`);

    // Ferme la connexion
    await mongoose.connection.close();
    console.log('Connexion à la base de données fermée');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    process.exit(1);
  }
};

seedAcademic();