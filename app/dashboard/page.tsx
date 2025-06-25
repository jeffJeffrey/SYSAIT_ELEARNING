
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lesson, Recommendation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function DashboardPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 10;
  const token = Cookies.get("token")

  // Pagination
  const totalPages = Math.ceil(lessons.length / lessonsPerPage);
  const startIndex = (currentPage - 1) * lessonsPerPage;
  const paginatedLessons = lessons.slice(startIndex, startIndex + lessonsPerPage);

  // Données pour le graphique (statut des leçons)
  const chartData = [
    { name: 'Planifiée', value: lessons.filter((l) => l.status === 'Planifiée').length },
    { name: 'Confirmée', value: lessons.filter((l) => l.status === 'Confirmée').length },
    { name: 'En attente', value: lessons.filter((l) => l.status === 'En attente').length },
  ];

  useEffect(() => {
    const fetchLessons = async () => {
      setLoadingLessons(true);
      try {
        const response = await axios.get(`${API_URL}/lessons`, {
          headers: {
            'X-school-id': '2',
            'X-scholastic-period-id': '1',
            'X-resource-data-type': 'original',
            'Authorization' : `Bearer ${token}`
          },
        });
        setLessons(response.data);
      } catch (err) {
        setError('Impossible de charger les leçons. Veuillez réessayer.');
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
    // fetchRecommendations();
  }, [token]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">
            Bienvenue sur votre tableau de bord, {user?.first_name} {user?.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Gérez vos leçons, consultez les recommandations, et suivez vos élèves depuis cet espace.
          </p>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lessons Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-blue-700">
            <Calendar className="inline mr-2 h-5 w-5" />
            Leçons à venir
          </CardTitle>
          <a href="/lessons" className="text-blue-600 hover:underline text-sm">
            Voir toutes les leçons
          </a>
        </CardHeader>
        <CardContent>
          {loadingLessons ? (
            <div className="flex items-center justify-center h-32">
              <motion.div
                className="text-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Clock className="h-6 w-6" />
              </motion.div>
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-gray-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Aucune leçon à venir.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cours</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.denomination}</TableCell>
                      <TableCell>{lesson.date}</TableCell>
                      <TableCell>{`${lesson.start_time} - ${lesson.end_time}`}</TableCell>
                      <TableCell>{`Salle ${lesson.local_id}`}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            lesson.status === 'Planifiée'
                              ? 'bg-blue-100 text-blue-700'
                              : lesson.status === 'Confirmée'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {lesson.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Lessons Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">
            Statistiques des leçons
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLessons ? (
            <div className="flex items-center justify-center h-[300px]">
              <motion.div
                className="text-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Clock className="h-6 w-6" />
              </motion.div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planning Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">
            <Clock className="inline mr-2 h-5 w-5" />
            Recommandations de planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRecommendations ? (
            <div className="flex items-center justify-center h-32">
              <motion.div
                className="text-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Clock className="h-6 w-6" />
              </motion.div>
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-gray-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Aucune recommandation disponible pour le moment.
            </p>
          ) : (
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li key={rec.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                  <span>
                    {rec.course} - {rec.suggestedTime} ({rec.local})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-100"
                    onClick={async () => {
                      try {
                        await api.post(
                          `/api/recommendations/accept/${rec.id}`,
                          {},
                          {
                            headers: {
                              'X-school-id': '2',
                              'X-scholastic-period-id': '1',
                              'X-resource-data-type': 'original',
                            },
                          }
                        );
                        setRecommendations(recommendations.filter((r) => r.id !== rec.id));
                      } catch (err) {
                        setError("Échec de l'acceptation de la recommandation.");
                      }
                    }}
                  >
                    Accepter
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
