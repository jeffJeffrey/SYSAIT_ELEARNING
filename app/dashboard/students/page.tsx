/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Search,
  Users,
  TrendingUp,
  BookOpen,
  Calendar,
  Star,
  Award,
  Clock,
  User,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'sonner';
import { Student } from '@/types';
import { mockStudents } from './students';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

  // Calculer les statistiques globales
  const totalStudents = students.length;
  const averageGrade = students.reduce((sum, student) => {
    const studentAvg = student.grades.length > 0 ? student.grades.reduce((a, b) => a + b, 0) / student.grades.length : 0;
    return sum + studentAvg;
  }, 0) / totalStudents;

  const studentsWithExtraActivities = students.filter(s => s.extra_activities.length > 0).length;
  const studentsWithDisciplinaryNotes = students.filter(s => s.disciplinary_notes.length > 0).length;

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
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

  const getStatusColor = (predictedClass?: string) => {
    if (!predictedClass) return 'bg-gray-100 text-gray-600';
    
    switch (predictedClass.toLowerCase()) {
      case 'à haut potentiel':
        return 'bg-emerald-100 text-emerald-800';
      case 'moyen':
        return 'bg-amber-100 text-amber-800';
      case 'à risque':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateStudentMetrics = (student: Student) => {
    const averageGrade = student.grades.length > 0 ? student.grades.reduce((a, b) => a + b, 0) / student.grades.length : 0;
    const attendanceRate = 100 - (student.absences.length / 180 * 100);
    const homeworkSubmissionRate = student.homework_submissions.length > 0 
      ? (student.homework_submissions.filter(hw => hw.submitted).length / student.homework_submissions.length) * 100 
      : 0;
    
    return {
      averageGrade: averageGrade.toFixed(1),
      attendanceRate: attendanceRate.toFixed(1),
      homeworkSubmissionRate: homeworkSubmissionRate.toFixed(1)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 font-medium">Chargement des données...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        className="container mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestion des Élèves
            </h1>
            <p className="text-slate-600">Suivez les performances et le développement de vos élèves</p>
          </motion.div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Élèves</p>
                    <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Moyenne Générale</p>
                    <p className="text-2xl font-bold text-slate-900">{averageGrade.toFixed(1)}/20</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Activités Extra</p>
                    <p className="text-2xl font-bold text-slate-900">{studentsWithExtraActivities}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Alertes Disciplinaires</p>
                    <p className="text-2xl font-bold text-slate-900">{studentsWithDisciplinaryNotes}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Liste des Élèves
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher un élève..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      toast.info('Liste rafraîchie.');
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Rafraîchir
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Aucun élève trouvé</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                          <TableHead className="text-slate-700 font-semibold">Élève</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Classe</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Moyenne</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Présence</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Devoirs</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Activités</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Statut</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedStudents.map((student, index) => {
                          const metrics = calculateStudentMetrics(student);
                          return (
                            <motion.tr
                              key={student.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-blue-50/50 transition-colors border-b border-slate-100"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {student.first_name[0]}{student.last_name[0]}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">{student.first_name} {student.last_name}</p>
                                    <p className="text-sm text-slate-500">{student.registration_number}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {student.classroom}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-amber-500" />
                                  <span className="font-semibold">{metrics.averageGrade}/20</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-green-500" />
                                  <span className="font-semibold">{metrics.attendanceRate}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="w-4 h-4 text-purple-500" />
                                  <span className="font-semibold">{metrics.homeworkSubmissionRate}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Award className="w-4 h-4 text-orange-500" />
                                  <span className="font-semibold">{student.extra_activities.length}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(student.predicted_class)} border-0`}>
                                  {student.predicted_class || 'Non évalué'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                  onClick={() => handleViewDetails(student.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Détails
                                </Button>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
                    <div className="text-sm text-slate-600">
                      Affichage de {startIndex + 1} à {Math.min(startIndex + studentsPerPage, filteredStudents.length)} sur {filteredStudents.length} élèves
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Précédent
                      </Button>
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}