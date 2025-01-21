# Structure de la Base de Données et Fonctionnalités

## 1. Modèle **User**

### Structure
```javascript
{
  username: String (unique),
  password: String (hashé),
  role: Enum ['student', 'teacher', 'parent', 'admin', 'staff'],
  name: String,
  email: String (unique),
  phone: String,
  createdAt: Date,
  lastLogin: Date,
  profilePicture: String,
  isActive: Boolean
}
```

### Fonctionnalités associées
- Authentification sécurisée (hashing, tokens, 2FA)
- Gestion des rôles et permissions
- Suivi des connexions
- Activation/Désactivation des comptes

---

## 2. Modèle **Class**

### Structure
```javascript
{
  name: String (unique),
  level: Enum ['6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'Tle', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
  academicYear: String,
  mainTeacher: ObjectId (ref: User),
  teachers: [{
    teacher: ObjectId (ref: User),
    subject: String
  }],
  students: [{
    student: ObjectId (ref: Student),
    enrollmentDate: Date,
    status: Enum ['active', 'transferred', 'inactive', 'graduated'],
    attendance: {
      present: Number,
      absent: Number,
      late: Number
    },
    academicPerformance: {
      averageGrade: Number,
      rank: Number,
      lastUpdated: Date
    }
  }],
  capacity: Number,
  schedule: [{
    day: Enum ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    startTime: String,
    endTime: String,
    subject: String,
    teacher: ObjectId (ref: User),
    room: String
  }],
  notifications: [{
    message: String,
    date: Date,
    sentBy: ObjectId (ref: User),
    recipients: [ObjectId (ref: User)]
  }]
}
```

### Fonctionnalités associées
- Gestion des classes (CRUD)
- Attribution des professeurs et suivi des matières
- Gestion des emplois du temps
- Notifications de classe
- Suivi des effectifs et des inscriptions

---

## 3. Modèle **Student** (hérite de User)

### Structure
```javascript
{
  studentId: String (unique),
  classes: [ObjectId (ref: Class)],
  currentGradeLevel: Enum ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'Tle'],
  dateOfBirth: Date,
  gender: Enum ['M', 'F', 'Other'],
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  parent: ObjectId (ref: User),
  grades: [{
    subject: String,
    value: Number,
    date: Date,
    semester: Enum ['S1', 'S2'],
    teacher: ObjectId (ref: User),
    comments: String
  }],
  attendance: [{
    date: Date,
    status: Enum ['present', 'absent', 'late'],
    reason: String,
    justification: {
      provided: Boolean,
      document: String,
      notes: String
    }
  }],
  disciplinaryRecords: [{
    date: Date,
    type: Enum ['warning', 'detention', 'suspension', 'expulsion'],
    reason: String,
    handledBy: ObjectId (ref: User),
    resolution: String
  }],
  extracurriculars: [{
    activity: String,
    role: String,
    startDate: Date,
    endDate: Date
  }]
}
```

### Fonctionnalités associées
- Gestion des informations personnelles
- Suivi académique (notes et rang)
- Suivi de l'assiduité
- Gestion des sanctions et des activités extrascolaires
- Relations avec les parents

---

## Relations entre les modèles

1. **User -> Student**
   - Un User avec le rôle `student` est lié à un profil Student.
   - Un User avec le rôle `parent` peut être lié à plusieurs Students.

2. **Class -> Student**
   - Une Class peut avoir plusieurs Students.
   - Un Student peut être inscrit dans plusieurs Classes.
   - Les relations incluent des métadonnées (assiduité, performance).

3. **Class -> User (Teacher)**
   - Une Class a un professeur principal (`mainTeacher`).
   - Une Class peut avoir plusieurs professeurs pour différentes matières.
   - Un User (Teacher) peut enseigner dans plusieurs Classes.

---

## Fonctionnalités Frontend par rôle

### **Admin**
- Gestion complète des utilisateurs
- Création et gestion des classes
- Attribution des professeurs et gestion des matières
- Consultation des statistiques globales
- Notifications globales

### **Teacher**
- Gestion des notes
- Suivi de l’assiduité
- Gestion des cours et emplois du temps
- Communication avec les parents et étudiants
- Notifications spécifiques à la classe

### **Student**
- Consultation des notes et du rang
- Consultation de l’emploi du temps
- Accès aux devoirs et ressources pédagogiques
- Messagerie avec enseignants et camarades

### **Parent**
- Suivi des performances académiques et de l’assiduité des enfants
- Consultation des emplois du temps
- Communication avec les professeurs et l’administration
- Notifications liées aux enfants

---

Cette version offre une structure enrichie et flexible pour un système de gestion scolaire, adaptable aux réalités académiques. Les modèles et fonctionnalités peuvent évoluer en fonction des besoins spécifiques.
