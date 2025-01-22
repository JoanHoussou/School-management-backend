const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');
const Level = require('../models/Level');

const seedDashboard = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/school_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Suppression des données existantes
    await User.deleteMany({});
    await Class.deleteMany({});
    await Level.deleteMany({});

    // Création du compte administrateur
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@school.com',
      name: 'Administrateur',
      role: 'admin',
      isActive: true
    });

    // Création des enseignants
    const teachers = await User.insertMany([
      {
        firstName: 'Pierre',
        lastName: 'Dupont',
        name: 'Pierre Dupont',
        username: 'pierre.dupont',
        email: 'pierre.dupont@school.com',
        password: 'password123',
        role: 'teacher',
        isActive: true,
        subjects: ['Mathématiques']
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        name: 'Marie Martin',
        username: 'marie.martin',
        email: 'marie.martin@school.com',
        password: 'password123',
        role: 'teacher',
        isActive: true,
        subjects: ['Français']
      },
      {
        firstName: 'Jean',
        lastName: 'Bernard',
        name: 'Jean Bernard',
        username: 'jean.bernard',
        email: 'jean.bernard@school.com',
        password: 'password123',
        role: 'teacher',
        isActive: true,
        subjects: ['Histoire']
      },
      {
        firstName: 'Sophie',
        lastName: 'Petit',
        name: 'Sophie Petit',
        username: 'sophie.petit',
        email: 'sophie.petit@school.com',
        password: 'password123',
        role: 'teacher',
        isActive: true,
        subjects: ['Anglais']
      },
    ]);

    // Création des classes
    const classes = await Class.insertMany([
      { name: '6ème A', level: '6eme', mainTeacher: teachers[0]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '6ème B', level: '6eme', mainTeacher: teachers[1]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '5ème A', level: '5eme', mainTeacher: teachers[2]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '5ème B', level: '5eme', mainTeacher: teachers[3]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '4ème A', level: '4eme', mainTeacher: teachers[0]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '4ème B', level: '4eme', mainTeacher: teachers[1]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '3ème A', level: '3eme', mainTeacher: teachers[2]._id, academicYear: '2023-2024', capacity: 30 },
      { name: '3ème B', level: '3eme', mainTeacher: teachers[3]._id, academicYear: '2023-2024', capacity: 30 },
    ]);

    // Création des étudiants
    const students = [];
    for (let i = 0; i < 100; i++) {
      const student = {
        firstName: `Étudiant${i}`,
        lastName: `Nom${i}`,
        name: `Étudiant${i} Nom${i}`,
        username: `student${i}`,
        email: `student${i}@school.com`,
        password: 'password123',
        role: 'student',
        isActive: true,
        class: classes[Math.floor(Math.random() * classes.length)]._id,
        parentEmail: `parent${i}@example.com`
      };
      students.push(student);
    }
    await User.insertMany(students);

    console.log('Données de démonstration créées avec succès !');
    console.log('Compte admin créé :');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création des données de démonstration:', error);
    process.exit(1);
  }
};

seedDashboard();