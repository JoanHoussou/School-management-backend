require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const users = [
  {
    username: 'student-1',
    password: 'password',
    email: 'student1@ecole.fr',
    role: 'student',
    name: 'Thomas Dubois'
  },
  {
    username: 'parent-1',
    password: 'password',
    email: 'parent1@ecole.fr',
    role: 'parent',
    name: 'M. Dubois'
  },
  {
    username: 'teacher-1',
    password: 'password',
    email: 'teacher1@ecole.fr',
    role: 'teacher',
    name: 'Prof. Martin'
  },
  {
    username: 'admin-1',
    password: 'password',
    email: 'admin1@ecole.fr',
    role: 'admin',
    name: 'Admin'
  },
  {
    username: 'joan',
    password: 'joan123',
    email: 'joan@ecole.fr',
    role: 'admin',
    name: 'Joan'
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Suppression des utilisateurs existants
    await User.deleteMany({});
    console.log('Base de données nettoyée');

    // Création des nouveaux utilisateurs
    const createdUsers = await User.create(users);
    console.log('Utilisateurs créés:', createdUsers.length);

    // Fermeture de la connexion
    await mongoose.connection.close();
    console.log('Connexion à la base de données fermée');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    process.exit(1);
  }
};

seedUsers();