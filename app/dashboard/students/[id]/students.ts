import { Student } from "./page";

export const mockStudents: Student[] = [
  // Étudiants à haut potentiel
  {
    id: 1,
    first_name: 'Emma',
    last_name: 'Dubois',
    classroom: '6ème A',
    registration_number: 'STU001',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Dr. Marie Dubois',
    parent2_name: 'Ing. Pierre Dubois',
    age: 11,
    sex: 'F',
    
    grades: [19, 18, 20, 18, 19, 17, 20, 19, 18, 20],
    absences: [
      { date: '2024-01-15', justified: true, reason: 'Compétition mathématiques' }
    ],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 19 },
      { date: '2024-01-17', submitted: true, grade: 20 },
      { date: '2024-01-24', submitted: true, grade: 18 },
      { date: '2024-01-31', submitted: true, grade: 19 },
      { date: '2024-02-07', submitted: true, grade: 20 }
    ],
    extra_activities: ['Club de Sciences', 'Échecs', 'Orchestre', 'Débats'],
    teacher_comments: [
      { comment: 'Élève exceptionnelle, très avancée pour son âge', score: 5, date: '2024-01-15' },
      { comment: 'Leadership naturel et aide ses camarades', score: 5, date: '2024-02-15' },
      { comment: 'Créativité remarquable dans ses projets', score: 5, date: '2024-03-15' }
    ],
    
    primary_school: 1,
    school_id: 1,
    classroom_id: 1,
    parent_occupation_level: 4,
    address_level: 4,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Latin']
  },
  {
    id: 2,
    first_name: 'Lucas',
    last_name: 'Martin',
    classroom: '5ème A',
    registration_number: 'STU002',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Prof. Claire Martin',
    parent2_name: 'Dr. Thomas Martin',
    age: 12,
    sex: 'M',
    
    grades: [18, 19, 17, 20, 18, 19, 18, 20, 17, 19],
    absences: [],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 18 },
      { date: '2024-01-17', submitted: true, grade: 19 },
      { date: '2024-01-24', submitted: true, grade: 20 },
      { date: '2024-01-31', submitted: true, grade: 18 },
      { date: '2024-02-07', submitted: true, grade: 19 }
    ],
    extra_activities: ['Robotique', 'Tennis', 'Théâtre'],
    teacher_comments: [
      { comment: 'Esprit analytique exceptionnel', score: 5, date: '2024-01-15' },
      { comment: 'Toujours prêt à relever des défis', score: 5, date: '2024-02-15' },
      { comment: 'Excellent travail d\'équipe', score: 5, date: '2024-03-15' }
    ],
    
    primary_school: 1,
    school_id: 1,
    classroom_id: 2,
    parent_occupation_level: 4,
    address_level: 4,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Allemand']
  },
  
  // Étudiants à risque
  {
    id: 3,
    first_name: 'Karim',
    last_name: 'Benzema',
    classroom: '4ème C',
    registration_number: 'STU003',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Fatima Benzema',
    age: 15,
    sex: 'M',
    
    grades: [6, 4, 8, 5, 7, 3, 6, 4, 5, 7],
    absences: [
      { date: '2024-01-12', justified: false },
      { date: '2024-01-15', justified: false },
      { date: '2024-01-25', justified: false },
      { date: '2024-02-08', justified: true, reason: 'Maladie' },
      { date: '2024-02-22', justified: false },
      { date: '2024-03-05', justified: false },
      { date: '2024-03-12', justified: false },
      { date: '2024-03-19', justified: false }
    ],
    disciplinary_notes: ['Comportement agressif', 'Refus de travailler', 'Perturbation constante', 'Manque de respect'],
    homework_submissions: [
      { date: '2024-01-10', submitted: false },
      { date: '2024-01-17', submitted: false },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: true, grade: 4 },
      { date: '2024-02-07', submitted: false }
    ],
    extra_activities: [],
    teacher_comments: [
      { comment: 'Élève en grande difficulté, besoin d\'aide urgente', score: 1, date: '2024-01-15' },
      { comment: 'Attitude très négative envers les études', score: 1, date: '2024-02-15' },
      { comment: 'Problèmes familiaux affectent le travail', score: 1, date: '2024-03-15' }
    ],
    
    primary_school: 3,
    school_id: 2,
    classroom_id: 8,
    parent_occupation_level: 1,
    address_level: 1,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire']
  },
  {
    id: 4,
    first_name: 'Melissa',
    last_name: 'Johnson',
    classroom: '3ème B',
    registration_number: 'STU004',
    first_enrollment_date: '2021-09-01',
    parent1_name: 'Sandra Johnson',
    age: 16,
    sex: 'F',
    
    grades: [5, 3, 7, 4, 6, 2, 5, 4, 3, 6],
    absences: [
      { date: '2024-01-08', justified: false },
      { date: '2024-01-12', justified: false },
      { date: '2024-01-18', justified: false },
      { date: '2024-01-25', justified: true, reason: 'Problème familial' },
      { date: '2024-02-02', justified: false },
      { date: '2024-02-15', justified: false },
      { date: '2024-02-28', justified: false }
    ],
    disciplinary_notes: ['Retards chroniques', 'Manque de motivation', 'Problèmes de concentration'],
    homework_submissions: [
      { date: '2024-01-10', submitted: false },
      { date: '2024-01-17', submitted: false },
      { date: '2024-01-24', submitted: true, grade: 5 },
      { date: '2024-01-31', submitted: false },
      { date: '2024-02-07', submitted: false }
    ],
    extra_activities: [],
    teacher_comments: [
      { comment: 'Manque de confiance en soi', score: 2, date: '2024-01-15' },
      { comment: 'Potentiel non exploité', score: 2, date: '2024-02-15' },
      { comment: 'Besoin d\'un suivi personnalisé', score: 2, date: '2024-03-15' }
    ],
    
    primary_school: 4,
    school_id: 2,
    classroom_id: 6,
    parent_occupation_level: 1,
    address_level: 2,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais']
  },
  
  // Étudiants moyens
  {
    id: 5,
    first_name: 'Sophie',
    last_name: 'Leroy',
    classroom: '5ème B',
    registration_number: 'STU005',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Claire Leroy',
    parent2_name: 'Marc Leroy',
    age: 13,
    sex: 'F',
    
    grades: [12, 14, 11, 13, 15, 12, 14, 13, 12, 14],
    absences: [
      { date: '2024-01-12', justified: true, reason: 'Maladie' },
      { date: '2024-02-08', justified: true, reason: 'Rendez-vous médical' },
      { date: '2024-03-05', justified: false }
    ],
    disciplinary_notes: ['Bavardages occasionnels'],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 12 },
      { date: '2024-01-17', submitted: true, grade: 14 },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: true, grade: 13 },
      { date: '2024-02-07', submitted: true, grade: 15 }
    ],
    extra_activities: ['Volleyball', 'Club lecture'],
    teacher_comments: [
      { comment: 'Élève sérieuse et appliquée', score: 3, date: '2024-01-15' },
      { comment: 'Progrès réguliers observés', score: 4, date: '2024-02-15' },
      { comment: 'Bonne participation en classe', score: 3, date: '2024-03-15' }
    ],
    
    primary_school: 2,
    school_id: 1,
    classroom_id: 3,
    parent_occupation_level: 3,
    address_level: 3,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais']
  },
  {
    id: 6,
    first_name: 'Antoine',
    last_name: 'Moreau',
    classroom: '6ème B',
    registration_number: 'STU006',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Julie Moreau',
    parent2_name: 'François Moreau',
    age: 12,
    sex: 'M',
    
    grades: [13, 11, 15, 12, 14, 13, 11, 16, 12, 14],
    absences: [
      { date: '2024-01-20', justified: true, reason: 'Voyage familial' },
      { date: '2024-02-14', justified: true, reason: 'Maladie' }
    ],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 13 },
      { date: '2024-01-17', submitted: true, grade: 12 },
      { date: '2024-01-24', submitted: true, grade: 15 },
      { date: '2024-01-31', submitted: false },
      { date: '2024-02-07', submitted: true, grade: 14 }
    ],
    extra_activities: ['Football', 'Musique'],
    teacher_comments: [
      { comment: 'Bon élève, efforts constants', score: 3, date: '2024-01-15' },
      { comment: 'Participe bien aux activités de groupe', score: 4, date: '2024-02-15' },
      { comment: 'Peut mieux faire en mathématiques', score: 3, date: '2024-03-15' }
    ],
    
    primary_school: 2,
    school_id: 1,
    classroom_id: 4,
    parent_occupation_level: 3,
    address_level: 3,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais']
  },
  
  // Plus d'étudiants à haut potentiel
  {
    id: 7,
    first_name: 'Léa',
    last_name: 'Rousseau',
    classroom: '4ème A',
    registration_number: 'STU007',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Dr. Anne Rousseau',
    parent2_name: 'Prof. Michel Rousseau',
    age: 13,
    sex: 'F',
    
    grades: [19, 20, 18, 19, 17, 20, 19, 18, 20, 19],
    absences: [],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 20 },
      { date: '2024-01-17', submitted: true, grade: 19 },
      { date: '2024-01-24', submitted: true, grade: 18 },
      { date: '2024-01-31', submitted: true, grade: 20 },
      { date: '2024-02-07', submitted: true, grade: 19 }
    ],
    extra_activities: ['Piano', 'Natation', 'Club de sciences', 'Tutorat'],
    teacher_comments: [
      { comment: 'Élève brillante avec un esprit critique développé', score: 5, date: '2024-01-15' },
      { comment: 'Aide spontanément ses camarades', score: 5, date: '2024-02-15' },
      { comment: 'Maturité exceptionnelle pour son âge', score: 5, date: '2024-03-15' }
    ],
    
    primary_school: 1,
    school_id: 1,
    classroom_id: 7,
    parent_occupation_level: 4,
    address_level: 4,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Espagnol', 'Latin']
  },
  
  // Plus d'étudiants à risque
  {
    id: 8,
    first_name: 'Dylan',
    last_name: 'Garcia',
    classroom: '5ème C',
    registration_number: 'STU008',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Maria Garcia',
    age: 14,
    sex: 'M',
    
    grades: [4, 6, 3, 5, 7, 4, 3, 6, 5, 4],
    absences: [
      { date: '2024-01-10', justified: false },
      { date: '2024-01-17', justified: false },
      { date: '2024-01-24', justified: false },
      { date: '2024-02-01', justified: true, reason: 'Problème familial' },
      { date: '2024-02-14', justified: false },
      { date: '2024-02-28', justified: false },
      { date: '2024-03-07', justified: false }
    ],
    disciplinary_notes: ['Violence verbale', 'Refus d\'autorité', 'Dégradations matérielles'],
    homework_submissions: [
      { date: '2024-01-10', submitted: false },
      { date: '2024-01-17', submitted: false },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: false },
      { date: '2024-02-07', submitted: true, grade: 3 }
    ],
    extra_activities: [],
    teacher_comments: [
      { comment: 'Comportement très préoccupant', score: 1, date: '2024-01-15' },
      { comment: 'Aucun intérêt pour les études', score: 1, date: '2024-02-15' },
      { comment: 'Influence négative sur la classe', score: 1, date: '2024-03-15' }
    ],
    
    primary_school: 5,
    school_id: 3,
    classroom_id: 9,
    parent_occupation_level: 1,
    address_level: 1,
    course_subjects: ['Mathématiques', 'Français', 'Sciences']
  },
  
  // Plus d'étudiants moyens
  {
    id: 9,
    first_name: 'Chloé',
    last_name: 'Bernard',
    classroom: '6ème C',
    registration_number: 'STU009',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Sylvie Bernard',
    parent2_name: 'Alain Bernard',
    age: 11,
    sex: 'F',
    
    grades: [14, 12, 15, 13, 14, 12, 16, 13, 14, 15],
    absences: [
      { date: '2024-02-12', justified: true, reason: 'Maladie' }
    ],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 14 },
      { date: '2024-01-17', submitted: true, grade: 13 },
      { date: '2024-01-24', submitted: true, grade: 15 },
      { date: '2024-01-31', submitted: true, grade: 12 },
      { date: '2024-02-07', submitted: false }
    ],
    extra_activities: ['Danse', 'Art plastique'],
    teacher_comments: [
      { comment: 'Élève créative et organisée', score: 4, date: '2024-01-15' },
      { comment: 'Bon esprit d\'équipe', score: 3, date: '2024-02-15' },
      { comment: 'Résultats satisfaisants', score: 3, date: '2024-03-15' }
    ],
    
    primary_school: 2,
    school_id: 1,
    classroom_id: 5,
    parent_occupation_level: 3,
    address_level: 3,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Arts']
  },
  {
    id: 10,
    first_name: 'Thomas',
    last_name: 'Petit',
    classroom: '4ème B',
    registration_number: 'STU010',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Nathalie Petit',
    parent2_name: 'Laurent Petit',
    age: 14,
    sex: 'M',
    
    grades: [11, 13, 12, 14, 13, 11, 15, 12, 13, 14],
    absences: [
      { date: '2024-01-18', justified: true, reason: 'Sport' },
      { date: '2024-02-22', justified: true, reason: 'Rendez-vous médical' }
    ],
    disciplinary_notes: ['Bavardages en cours'],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 12 },
      { date: '2024-01-17', submitted: true, grade: 13 },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: true, grade: 14 },
      { date: '2024-02-07', submitted: true, grade: 11 }
    ],
    extra_activities: ['Basketball', 'Informatique'],
    teacher_comments: [
      { comment: 'Élève consciencieux dans l\'ensemble', score: 3, date: '2024-01-15' },
      { comment: 'Bon en sciences, peut progresser en français', score: 3, date: '2024-02-15' },
      { comment: 'Attitude positive', score: 4, date: '2024-03-15' }
    ],
    
    primary_school: 2,
    school_id: 1,
    classroom_id: 8,
    parent_occupation_level: 3,
    address_level: 3,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Technologie']
  },
  
  // Étudiant à haut potentiel
  {
    id: 11,
    first_name: 'Maxime',
    last_name: 'Dupuis',
    classroom: '3ème A',
    registration_number: 'STU011',
    first_enrollment_date: '2021-09-01',
    parent1_name: 'Dr. Catherine Dupuis',
    parent2_name: 'Ing. Philippe Dupuis',
    age: 15,
    sex: 'M',
    
    grades: [18, 19, 20, 17, 19, 18, 20, 19, 18, 20],
    absences: [],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 19 },
      { date: '2024-01-17', submitted: true, grade: 20 },
      { date: '2024-01-24', submitted: true, grade: 18 },
      { date: '2024-01-31', submitted: true, grade: 19 },
      { date: '2024-02-07', submitted: true, grade: 20 }
    ],
    extra_activities: ['Programmation', 'Échecs', 'Mathématiques avancées', 'Débats'],
    teacher_comments: [
      { comment: 'Esprit logique remarquable', score: 5, date: '2024-01-15' },
      { comment: 'Capacité d\'abstraction exceptionnelle', score: 5, date: '2024-02-15' },
      { comment: 'Futur ingénieur ou chercheur', score: 5, date: '2024-03-15' }
    ],
    
    primary_school: 1,
    school_id: 1,
    classroom_id: 6,
    parent_occupation_level: 4,
    address_level: 4,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Allemand', 'Informatique']
  },
  
  // Étudiant à risque
  {
    id: 12,
    first_name: 'Yasmine',
    last_name: 'Alaoui',
    classroom: '6ème D',
    registration_number: 'STU012',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Aicha Alaoui',
    age: 13,
    sex: 'F',
    
    grades: [5, 7, 4, 6, 3, 8, 5, 4, 6, 7],
    absences: [
      { date: '2024-01-15', justified: false },
      { date: '2024-01-22', justified: false },
      { date: '2024-02-05', justified: true, reason: 'Maladie' },
      { date: '2024-02-19', justified: false },
      { date: '2024-03-01', justified: false },
      { date: '2024-03-15', justified: false }
    ],
    disciplinary_notes: ['Difficultés de concentration', 'Manque de matériel'],
    homework_submissions: [
      { date: '2024-01-10', submitted: false },
      { date: '2024-01-17', submitted: true, grade: 6 },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: false },
      { date: '2024-02-07', submitted: true, grade: 5 }
    ],
    extra_activities: [],
    teacher_comments: [
      { comment: 'Difficultés linguistiques importantes', score: 2, date: '2024-01-15' },
      { comment: 'Manque de soutien à la maison', score: 2, date: '2024-02-15' },
      { comment: 'Volonté d\'apprendre présente mais obstacles nombreux', score: 2, date: '2024-03-15' }
    ],
    
    primary_school: 4,
    school_id: 2,
    classroom_id: 10,
    parent_occupation_level: 1,
    address_level: 1,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire']
  },
  
  // Étudiants moyens
  {
    id: 13,
    first_name: 'Hugo',
    last_name: 'Roux',
    classroom: '5ème D',
    registration_number: 'STU013',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Isabelle Roux',
    parent2_name: 'Christophe Roux',
    age: 13,
    sex: 'M',
    
    grades: [12, 14, 13, 11, 15, 13, 12, 14, 13, 12],
    absences: [
      { date: '2024-01-25', justified: true, reason: 'Sport' },
      { date: '2024-03-08', justified: true, reason: 'Voyage scolaire' }
    ],
    disciplinary_notes: [],
    homework_submissions: [
      { date: '2024-01-10', submitted: true, grade: 13 },
      { date: '2024-01-17', submitted: true, grade: 14 },
      { date: '2024-01-24', submitted: true, grade: 12 },
      { date: '2024-01-31', submitted: false },
      { date: '2024-02-07', submitted: true, grade: 15 }
    ],
    extra_activities: ['Rugby', 'Scout'],
    teacher_comments: [
      { comment: 'Élève équilibré et sympathique', score: 4, date: '2024-01-15' },
      { comment: 'Esprit d\'équipe développé', score: 4, date: '2024-02-15' },
      { comment: 'Résultats convenables', score: 3, date: '2024-03-15' }],
    primary_school: 1,
    school_id: 1,
    classroom_id: 1,
    parent_occupation_level: 3,
    address_level: 3,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais']
  },
  {
    id: 2,
    first_name: 'Sophie',
    last_name: 'Martin',
    classroom: '5ème B',
    registration_number: 'STU002',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Claire Martin',
    age: 13,
    sex: 'F',
    
    grades: [12, 10, 14, 11, 13, 9, 15, 12, 10, 13],
    absences: [
      { date: '2024-01-12', justified: false },
      { date: '2024-01-25', justified: false },
      { date: '2024-02-08', justified: true, reason: 'Problème familial' },
      { date: '2024-02-22', justified: false },
      { date: '2024-03-05', justified: false }
    ],
    disciplinary_notes: ['Comportement perturbateur', 'Retards répétés', 'Non-respect des consignes'],
    homework_submissions: [
      { date: '2024-01-10', submitted: false },
      { date: '2024-01-17', submitted: true, grade: 12 },
      { date: '2024-01-24', submitted: false },
      { date: '2024-01-31', submitted: true, grade: 10 },
      { date: '2024-02-07', submitted: false }
    ],
    extra_activities: ['Théâtre'],
    teacher_comments: [
      { comment: 'Doit faire plus d\'efforts', score: 2, date: '2024-01-15' },
      { comment: 'Attitude à améliorer', score: 2, date: '2024-02-15' },
      { comment: 'Progrès notés récemment', score: 3, date: '2024-03-15' }
    ],
    
    primary_school: 2,
    school_id: 1,
    classroom_id: 2,
    parent_occupation_level: 2,
    address_level: 2,
    course_subjects: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Anglais', 'Arts']
  }
];
