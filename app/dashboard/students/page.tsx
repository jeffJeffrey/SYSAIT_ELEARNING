/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Student {
  [x: string]: unknown;
  id: number;
  first_name: string;
  last_name: string;
  classroom: string;
  predicted_class: 'À risque' | 'Moyen' | 'À haut potentiel';
  registration_number: string;
  first_enrollment_date: string;
  parent1_name?: string;
  parent2_name?: string;
  mark_average?: number;
  attendance_rate?: number;
  disciplinary_notes?: string[];
  homework_completion_rate?: number;
  extra_activities?: string[];
}

const mockStudents: Student[] = [
  {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU001',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Marie Dupont',
    parent2_name: 'Pierre Dupont',
    mark_average: 85.5,
    attendance_rate: 98,
    disciplinary_notes: [],
    homework_completion_rate: 95,
    extra_activities: ['Club de Maths', 'Échecs'],
  },
  {
    id: 2,
    first_name: 'Sophie',
    last_name: 'Martin',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU002',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Claire Martin',
    mark_average: 70,
    attendance_rate: 90,
    disciplinary_notes: ['Retard répété'],
    homework_completion_rate: 80,
    extra_activities: ['Théâtre'],
  },
  {
    id: 3,
    first_name: 'Lucas',
    last_name: 'Bernard',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU003',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Paul Bernard',
    mark_average: 55,
    attendance_rate: 85,
    disciplinary_notes: ['Comportement perturbateur', 'Absence injustifiée'],
    homework_completion_rate: 60,
    extra_activities: [],
  },
  {
    id: 4,
    first_name: 'Emma',
    last_name: 'Petit',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU004',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Anne Petit',
    parent2_name: 'Louis Petit',
    mark_average: 90,
    attendance_rate: 99,
    disciplinary_notes: [],
    homework_completion_rate: 98,
    extra_activities: ['Musique', 'Natation'],
  },
  {
    id: 5,
    first_name: 'Thomas',
    last_name: 'Moreau',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU005',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Julie Moreau',
    mark_average: 72,
    attendance_rate: 92,
    disciplinary_notes: ['Retard occasionnel'],
    homework_completion_rate: 85,
    extra_activities: ['Football'],
  },
  {
    id: 6,
    first_name: 'Chloe',
    last_name: 'Roux',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU006',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Marc Roux',
    mark_average: 50,
    attendance_rate: 80,
    disciplinary_notes: ['Non-respect des règles'],
    homework_completion_rate: 55,
    extra_activities: [],
  },
  {
    id: 7,
    first_name: 'Hugo',
    last_name: 'Fournier',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU007',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Sophie Fournier',
    parent2_name: 'Antoine Fournier',
    mark_average: 88,
    attendance_rate: 97,
    disciplinary_notes: [],
    homework_completion_rate: 96,
    extra_activities: ['Club scientifique'],
  },
  {
    id: 8,
    first_name: 'Léa',
    last_name: 'Girard',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU008',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Élise Girard',
    mark_average: 68,
    attendance_rate: 89,
    disciplinary_notes: [],
    homework_completion_rate: 82,
    extra_activities: ['Danse'],
  },
  {
    id: 9,
    first_name: 'Noah',
    last_name: 'Lemoine',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU009',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'François Lemoine',
    mark_average: 53,
    attendance_rate: 83,
    disciplinary_notes: ['Absence injustifiée'],
    homework_completion_rate: 58,
    extra_activities: [],
  },
  {
    id: 10,
    first_name: 'Manon',
    last_name: 'Guerin',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU010',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Céline Guerin',
    parent2_name: 'Jacques Guerin',
    mark_average: 92,
    attendance_rate: 99,
    disciplinary_notes: [],
    homework_completion_rate: 97,
    extra_activities: ['Peinture', 'Chorale'],
  },
  {
    id: 11,
    first_name: 'Adam',
    last_name: 'Fontaine',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU011',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Isabelle Fontaine',
    mark_average: 71,
    attendance_rate: 91,
    disciplinary_notes: ['Retard'],
    homework_completion_rate: 84,
    extra_activities: ['Basketball'],
  },
  {
    id: 12,
    first_name: 'Clara',
    last_name: 'Lambert',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU012',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Vincent Lambert',
    mark_average: 57,
    attendance_rate: 84,
    disciplinary_notes: ['Comportement inapproprié'],
    homework_completion_rate: 62,
    extra_activities: [],
  },
  {
    id: 13,
    first_name: 'Louis',
    last_name: 'Renaud',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU013',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Nathalie Renaud',
    parent2_name: 'Philippe Renaud',
    mark_average: 87,
    attendance_rate: 96,
    disciplinary_notes: [],
    homework_completion_rate: 94,
    extra_activities: ['Club de lecture'],
  },
  {
    id: 14,
    first_name: 'Zoé',
    last_name: 'Perrin',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU014',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Laura Perrin',
    mark_average: 69,
    attendance_rate: 90,
    disciplinary_notes: [],
    homework_completion_rate: 81,
    extra_activities: ['Gymnastique'],
  },
  {
    id: 15,
    first_name: 'Tom',
    last_name: 'Dufour',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU015',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Michel Dufour',
    mark_average: 54,
    attendance_rate: 82,
    disciplinary_notes: ['Retard répété', 'Non-respect des consignes'],
    homework_completion_rate: 59,
    extra_activities: [],
  },
  {
    id: 16,
    first_name: 'Alice',
    last_name: 'Marchand',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU016',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Valérie Marchand',
    parent2_name: 'Éric Marchand',
    mark_average: 91,
    attendance_rate: 98,
    disciplinary_notes: [],
    homework_completion_rate: 96,
    extra_activities: ['Club d’art'],
  },
  {
    id: 17,
    first_name: 'Mathis',
    last_name: 'Gautier',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU017',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Sandrine Gautier',
    mark_average: 73,
    attendance_rate: 93,
    disciplinary_notes: [],
    homework_completion_rate: 83,
    extra_activities: ['Tennis'],
  },
  {
    id: 18,
    first_name: 'Lola',
    last_name: 'Barbier',
    classroom: '4ème C',
    predicted_class: 'À risque',
    registration_number: 'STU018',
    first_enrollment_date: '2022-09-01',
    parent1_name: 'Christophe Barbier',
    mark_average: 52,
    attendance_rate: 81,
    disciplinary_notes: ['Absence injustifiée'],
    homework_completion_rate: 57,
    extra_activities: [],
  },
  {
    id: 19,
    first_name: 'Arthur',
    last_name: 'Lacroix',
    classroom: '6ème A',
    predicted_class: 'À haut potentiel',
    registration_number: 'STU019',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Catherine Lacroix',
    parent2_name: 'Sébastien Lacroix',
    mark_average: 89,
    attendance_rate: 97,
    disciplinary_notes: [],
    homework_completion_rate: 95,
    extra_activities: ['Club d’informatique'],
  },
  {
    id: 20,
    first_name: 'Inès',
    last_name: 'Faure',
    classroom: '5ème B',
    predicted_class: 'Moyen',
    registration_number: 'STU020',
    first_enrollment_date: '2023-09-01',
    parent1_name: 'Dominique Faure',
    mark_average: 70,
    attendance_rate: 91,
    disciplinary_notes: ['Retard occasionnel'],
    homework_completion_rate: 82,
    extra_activities: ['Danse'],
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const token = Cookies.get('token');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Placeholder for actual API call
        // const response = await axios.get(`${API_URL}/students`, {
        //   headers: {
        //     'X-school-id': '2',
        //     'X-scholastic-period-id': '1',
        //     'X-resource-data-type': 'original',
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // setStudents(response.data);
        // setFilteredStudents(response.data);
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
        toast.success('Liste des étudiants chargée avec succès.');
      } catch (err) {
        setError('Impossible de charger les étudiants. Veuillez réessayer.');
        toast.error('Échec du chargement des étudiants.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        `${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.classroom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registration_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, students]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      toast.info(`Page changée à ${page}`);
    }
  };

  const handleViewDetails = (studentId: number) => {
    router.push(`/dashboard/students/${studentId}`);
    toast.success(`Ouverture des détails de l'étudiant ID ${studentId}.`);
  };

  return (
    <motion.div
      className="flex-1 space-y-6 p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Students Table */}
      <Card className ="border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
            Gestion des étudiants
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
              />
            </div>
            <a
              href="/students"
              className="text-blue-600 hover:underline text-sm flex items-center"
              onClick={() => toast.info('Liste rafraîchie.')}
            >
              Rafraîchir
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <motion.div
                className="text-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle className="h-8 w-8" />
              </motion.div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-gray-500 flex items-center justify-center py-8">
              <AlertCircle className="h-5 w-5 mr-2" />
              Aucun étudiant trouvé.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="text-blue-800 font-semibold">Nom</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Classe</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Performance prédite</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="font-medium">{`${student.first_name} ${student.last_name}`}</TableCell>
                      <TableCell>{student.classroom}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.predicted_class === 'À haut potentiel'
                              ? 'bg-green-100 text-green-800'
                              : student.predictedStuart
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.predicted_class}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-100"
                          onClick={() => handleViewDetails(student.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}