# Roadmap des Routes API

## 1. Gestion des Utilisateurs et Authentification ✓
- POST /api/auth/login ✓
- POST /api/auth/register ✓
- POST /api/auth/logout ✓
- GET /api/auth/profile ✓

## 2. Gestion des Classes (ClassManager)
- GET /api/classes - Liste des classes
- POST /api/classes - Créer une classe
- GET /api/classes/:id - Détails d'une classe
- PUT /api/classes/:id - Modifier une classe
- DELETE /api/classes/:id - Supprimer une classe
- POST /api/classes/:id/students - Ajouter des élèves à une classe

## 3. Gestion Académique (AcademicManager)
- GET /api/subjects - Liste des matières
- POST /api/subjects - Créer une matière
- PUT /api/subjects/:id - Modifier une matière
- GET /api/curriculum - Programme scolaire
- POST /api/curriculum - Créer un élément du programme
- PUT /api/curriculum/:id - Modifier le programme

## 4. Gestion des Notes (GradesManager)
- GET /api/grades/student/:studentId - Notes d'un élève
- POST /api/grades - Ajouter une note
- PUT /api/grades/:id - Modifier une note
- GET /api/grades/class/:classId - Notes d'une classe
- GET /api/grades/stats/class/:classId - Statistiques de classe

## 5. Gestion des Devoirs (AssignmentsManager)
- GET /api/assignments - Liste des devoirs
- POST /api/assignments - Créer un devoir
- PUT /api/assignments/:id - Modifier un devoir
- DELETE /api/assignments/:id - Supprimer un devoir
- POST /api/assignments/:id/submit - Soumettre un devoir (élèves)
- PUT /api/assignments/:id/grade - Noter un devoir (professeurs)

## 6. Gestion de l'Emploi du temps (Schedule)
- GET /api/schedule/class/:classId - Emploi du temps d'une classe
- GET /api/schedule/teacher/:teacherId - Emploi du temps d'un professeur
- POST /api/schedule - Ajouter un créneau
- PUT /api/schedule/:id - Modifier un créneau
- DELETE /api/schedule/:id - Supprimer un créneau

## 7. Messagerie (Messages)
- GET /api/messages - Liste des messages
- POST /api/messages - Envoyer un message
- GET /api/messages/:id - Détails d'un message
- PUT /api/messages/:id/read - Marquer comme lu
- DELETE /api/messages/:id - Supprimer un message

## 8. Gestion des Présences (AttendanceRecords)
- GET /api/attendance/class/:classId - Présences d'une classe
- POST /api/attendance - Enregistrer les présences
- PUT /api/attendance/:id - Modifier une présence
- GET /api/attendance/stats/student/:studentId - Statistiques de présence
- GET /api/attendance/stats/class/:classId - Statistiques de classe

## 9. Performance et Rapports (Reports)
- GET /api/reports/academic - Rapports académiques
- GET /api/reports/attendance - Rapports de présence
- GET /api/reports/performance/class/:classId - Performance par classe
- GET /api/reports/performance/student/:studentId - Performance par élève
- GET /api/reports/generate/:type - Générer un rapport spécifique

## Prochaine implémentation : Gestion des Classes
La première fonctionnalité à implémenter sera la gestion des classes car c'est une fonctionnalité fondamentale dont dépendent plusieurs autres modules :

1. Créer le modèle Mongoose pour les classes
2. Implémenter les routes CRUD pour les classes
3. Créer le service frontend pour la gestion des classes
4. Connecter le frontend au backend