const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Level = require('../models/Level');

const dashboardController = {
  // Obtenir les statistiques globales
  async getStats(req, res) {
    try {
      const [students, teachers, classes] = await Promise.all([
        User.countDocuments({ role: 'student', isActive: true }),
        User.countDocuments({ role: 'teacher', isActive: true }),
        Class.countDocuments()
      ]);

      // Calculer le taux de présence pour aujourd'hui (exemple)
      const todayAttendance = 95; // À implémenter avec un vrai système de présence

      res.json({
        totalStudents: students,
        totalTeachers: teachers,
        totalClasses: classes,
        quickStats: {
          todayAttendance,
          pendingRequests: 0, // À implémenter
          ongoingClasses: Math.floor(classes * 0.6), // Exemple: 60% des classes sont actives
          newStudentsThisMonth: 0 // À implémenter
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les données du personnel
  async getStaffOverview(req, res) {
    try {
      const teachers = await User.find({ role: 'teacher' });
      
      // Regrouper les enseignants par matière
      const bySubject = [];
      const subjectCounts = {};
      
      teachers.forEach(teacher => {
        (teacher.subjects || []).forEach(subject => {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
      });

      Object.entries(subjectCounts).forEach(([subject, count]) => {
        bySubject.push({ subject, count });
      });

      res.json({
        teachers: {
          total: teachers.length,
          present: teachers.filter(t => t.isActive).length,
          bySubject
        },
        administration: {
          total: 8, // À implémenter
          present: 8
        },
        support: {
          total: 12, // À implémenter
          present: 11
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les performances académiques
  async getAcademicPerformance(req, res) {
    try {
      // Simuler des données de performance
      // À remplacer par de vraies données de la base de données
      const performance = {
        averagesByLevel: {
          '6eme': 14.5,
          '5eme': 13.8,
          '4eme': 14.2,
          '3eme': 13.9
        },
        successRate: {
          '6eme': 92,
          '5eme': 90,
          '4eme': 88,
          '3eme': 85
        },
        topPerformingSubjects: [
          { subject: 'Mathématiques', average: 14.8 },
          { subject: 'EPS', average: 15.2 },
          { subject: 'Anglais', average: 14.5 }
        ]
      };

      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir la vue d'ensemble des classes
  async getClassesOverview(req, res) {
    try {
      const levels = await Level.find().populate('classes');
      const classesOverview = {};

      for (const level of levels) {
        const levelKey = level.name.toLowerCase().replace('è', 'e');
        const classes = level.classes || [];
        
        classesOverview[levelKey] = {
          totalStudents: await User.countDocuments({ 
            role: 'student', 
            class: { $in: classes.map(c => c._id) }
          }),
          classes: await Promise.all(classes.map(async (classe) => {
            const students = await User.countDocuments({ class: classe._id, role: 'student' });
            return {
              name: classe.name,
              students,
              performance: Math.floor(Math.random() * 20) + 80, // Exemple
              attendance: Math.floor(Math.random() * 10) + 90 // Exemple
            };
          })),
          bestClass: classes.length > 0 ? classes[0].name : null // À améliorer avec de vraies métriques
        };
      }

      res.json(classesOverview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = dashboardController;