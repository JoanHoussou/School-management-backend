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
    name: 'Thomas Dubois',
    phone: '0123456789',
    profilePicture: 'https://example.com/avatar1.jpg',
    isActive: true
  },
  {
    username: 'parent-1',
    password: 'password',
    email: 'parent1@ecole.fr',
    role: 'parent',
    name: 'M. Dubois',
    phone: '0123456790',
    profilePicture: 'https://example.com/avatar2.jpg',
    isActive: true
  },
  {
    username: 'teacher-1',
    password: 'password',
    email: 'teacher1@ecole.fr',
    role: 'teacher',
    name: 'Prof. Martin',
    phone: '0123456791',
    profilePicture: 'https://example.com/avatar3.jpg',
    isActive: true
  },
  {
    username: 'teacher-2',
    password: 'password',
    email: 'teacher2@ecole.fr',
    role: 'teacher',
    name: 'Prof. Dubois',
    phone: '0123456792',
    profilePicture: 'https://example.com/avatar4.jpg',
    isActive: true
  },
  {
    username: 'teacher-3',
    password: 'password',
    email: 'teacher3@ecole.fr',
    role: 'teacher',
    name: 'Prof. Bernard',
    phone: '0123456793',
    profilePicture: 'https://example.com/avatar5.jpg',
    isActive: true
  },
  {
    username: 'admin-1',
    password: 'password',
    email: 'admin1@ecole.fr',
    role: 'admin',
    name: 'Admin',
    phone: '0123456794',
    profilePicture: 'https://example.com/avatar6.jpg',
    isActive: true
  },
  {
    username: 'joan',
    password: 'joan123',
    email: 'joan@ecole.fr',
    role: 'admin',
    name: 'Joan',
    phone: '0123456795',
    profilePicture: 'https://example.com/avatar7.jpg',
    isActive: true
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