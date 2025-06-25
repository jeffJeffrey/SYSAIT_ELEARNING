/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Lesson, Recommendation, Day } from '@/types';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
  getDay,
  locales: { fr },
});

const DAYS_OF_WEEK = [
  { id: 1, label: 'Lundi' },
  { id: 2, label: 'Mardi' },
  { id: 3, label: 'Mercredi' },
  { id: 4, label: 'Jeudi' },
  { id: 5, label: 'Vendredi' },
  { id: 6, label: 'Samedi' },
  { id: 7, label: 'Dimanche' },
];

const CLASSROOMS = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  label: `Salle de classe ${i + 1}`,
}));

const COURSES = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  label: `Cours ${i + 1}`,
}));

export default function LessonsPage() {
  const { user } = useAuth();
  const token = Cookies.get('token');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingLessons, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lessonsPerPage = 10;
  const [newLesson, setNewLesson] = useState({
    denomination: '',
    description: '',
    course_id: '',
    serve_id: '1',
    local_id: '',
    date: '',
    start_time: '',
    end_time: '',
    end_date: '',
    repeat: false,
    frequency: '1',
    repeat_every_n: '1',
    all_days: true,
    days: [] as Day[],
  });

  // Pagination
  const totalPages = Math.ceil(lessons.length / lessonsPerPage);
  const startIndex = (currentPage - 1) * lessonsPerPage;
  const paginatedLessons = lessons.slice(startIndex, startIndex + lessonsPerPage);

  // Calendar Events
  const calendarEvents = lessons.map((lesson) => ({
    title: lesson.denomination,
    start: new Date(`${lesson.date}T${lesson.start_time}`),
    end: new Date(`${lesson.date}T${lesson.end_time}`),
    allDay: false,
  }));

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/lessons`, {
          headers: {
            'X-school-id': '2',
            'X-scholastic-period-id': '1',
            'X-resource-data-type': 'original',
            Authorization: `Bearer ${token}`,
          },
        });
        setLessons(response.data.reverse());
       toast.success("Leçons chargées avec succès")
      } catch (err) {
        setError('Impossible de charger les leçons. Veuillez réessayer.');
        toast.error("Erreur de chargement des lecons")
      } finally {
        setLoading(false);
      }
    };

    // const fetchRecommendations = async () => {
    //   setLoadingRecommendations(true);
    //   try {
    //     const response = await axios.get(`${API_URL}/recommendations/plan`, {
    //       headers: {
    //         'X-school-id': '2',
    //         'X-scholastic-period-id': '1',
    //         'X-resource-data-type': 'original',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     setRecommendations(response.data);
    //     toast.success("Recommandations chargées avec succès.")
    //   } catch (err) {
    //     setError('Impossible de charger les recommandations. Veuillez réessayer.');
    //     toast.error("Échec du chargement des recommandations.")
    //   } finally {
    //     setLoadingRecommendations(false);
    //   }
    // };

    fetchLessons();
    // fetchRecommendations();
  }, [token]);

  const handleAddLesson = async () => {
    if (newLesson.end_date && newLesson.date && newLesson.end_date < newLesson.date) {
      setError('La date de fin doit être postérieure à la date de débuts.');
      toast.error("La date de fin doit être postérieure à la date de début.")
      return;
    }
    if (newLesson.repeat && !newLesson.days.length && !newLesson.all_days && newLesson.frequency === '2') {
      setError('Veuillez sélectionner au moins un jour pour les répétitions hebdomadaires.');
     toast.error("Sélectionnez au moins un jour pour les répétitions hebdomadaires.")
      return;
    }

    try {
      const payload = {
        denomination: newLesson.denomination,
        description: newLesson.description,
        course_id: parseInt(newLesson.course_id),
        serve_id: user?.id,
        local_id: parseInt(newLesson.local_id),
        date: newLesson.date,
        start_time: newLesson.start_time,
        end_time: newLesson.end_time,
        end_date: newLesson.end_date || undefined,
        repeat: newLesson.repeat,
        frequency: parseInt(newLesson.frequency),
        repeat_every_n: parseInt(newLesson.repeat_every_n),
        all_days: newLesson.all_days,
        days: newLesson.days,
      };

      await axios.post(`${API_URL}/lessons`, payload, {
        headers: {
          'X-school-id': '2',
          'X-scholastic-period-id': '1',
          'X-resource-data-type': 'original',
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSidebarOpen(false);
      setNewLesson({
        denomination: '',
        description: '',
        course_id: '',
        serve_id: '1',
        local_id: '',
        date: '',
        start_time: '',
        end_time: '',
        end_date: '',
        repeat: false,
        frequency: '1',
        repeat_every_n: '1',
        all_days: true,
        days: [],
      });
      const response = await axios.get(`${API_URL}/lessons`, {
        headers: {
          'X-school-id': '2',
          'X-scholastic-period-id': '1',
          'X-resource-data-type': 'original',
          Authorization: `Bearer ${token}`,
        },
      });
      setLessons(response.data.reverse());
      toast.success("Leçon ajoutée avec succès.")
    } catch (err) {
      setError("Échec de l'ajout de la leçon. Veuillez réessayer.");
      toast("Échec de l'ajout de la leçon.")
    }
  };

  const handleDeleteLesson = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/lessons/${id}`, {
        headers: {
          'X-school-id': '2',
          'X-scholastic-period-id': '1',
          'X-resource-data-type': 'original',
          Authorization: `Bearer ${token}`,
        },
      });
      setLessons(lessons.filter((lesson) => lesson.id !== id));
      toast.success("Leçon supprimée avec succès.")
    } catch (err) {
      setError('Échec de la suppression de la leçon. Veuillez réessayer.');
      toast("Échec de la suppression de la leçon.")
    }
  };

  const handleAddDay = () => {
    setNewLesson({
      ...newLesson,
      days: [...newLesson.days, { day: 1, start_time: '', end_time: '' }],
    });
  };

  const handleUpdateDay = (index: number, field: keyof Day, value: string | number) => {
    const updatedDays = [...newLesson.days];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setNewLesson({ ...newLesson, days: updatedDays });
  };

  const handleRemoveDay = (index: number) => {
    setNewLesson({
      ...newLesson,
      days: newLesson.days.filter((_, i) => i !== index),
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCalendarSelectSlot = ({ start }: { start: Date }) => {
    setNewLesson({
      ...newLesson,
      date: format(start, 'yyyy-MM-dd'),
    });
    setIsSidebarOpen(true);
  };

  return (
    <div className="relative flex space-x-6">
      {/* Sidebar for Lesson Creation */}
      <motion.div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-10 p-6 overflow-y-auto transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        initial={{ x: '100%' }}
        animate={{ x: isSidebarOpen ? 0 : '100%' }}
      >
        <div className="flex justify-between items-center mb-4" >
          <h2 className="text-xl font-semibold text-blue-700">Ajouter une leçon</h2>
          <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nom de la leçon</label>
            <Input
              value={newLesson.denomination}
              onChange={(e) => setNewLesson({ ...newLesson, denomination: e.target.value })}
              placeholder="Ex: Mathématiques 6ème M1: Lesson 001"
              className="border-gray-300 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Input
              value={newLesson.description}
              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              placeholder="Description de la leçon"
              className="border-gray-300 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Cours</label>
            <Select
              value={newLesson.course_id}
              onValueChange={(value) => setNewLesson({ ...newLesson, course_id: value })}
            >
              <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Salle</label>
            <Select
              value={newLesson.local_id}
              onValueChange={(value) => setNewLesson({ ...newLesson, local_id: value })}
            >
              <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {CLASSROOMS.map((classroom) => (
                  <SelectItem key={classroom.id} value={classroom.id}>
                    {classroom.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Date de début</label>
            <Input
              type="date"
              value={newLesson.date}
              onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
              className="border-gray-300 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Heure de début</label>
            <Input
              type="time"
              value={newLesson.start_time}
              onChange={(e) => setNewLesson({ ...newLesson, start_time: e.target.value })}
              className="border-gray-300 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Heure de fin</label>
            <Input
              type="time"
              value={newLesson.end_time}
              onChange={(e) => setNewLesson({ ...newLesson, end_time: e.target.value })}
              className="border-gray-300 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={newLesson.repeat}
              onCheckedChange={(checked) => setNewLesson({ ...newLesson, repeat: !!checked })}
            />
            <label className="text-sm font-medium text-gray-700">Répéter la leçon</label>
          </div>
          {newLesson.repeat && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Date de fin</label>
                <Input
                  type="date"
                  value={newLesson.end_date}
                  onChange={(e) => setNewLesson({ ...newLesson, end_date: e.target.value })}
                  className="border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fréquence</label>
                <Select
                  value={newLesson.frequency}
                  onValueChange={(value) => setNewLesson({ ...newLesson, frequency: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner la fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Quotidien</SelectItem>
                    <SelectItem value="2">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Répéter tous les</label>
                <Input
                  type="number"
                  value={newLesson.repeat_every_n}
                  onChange={(e) => setNewLesson({ ...newLesson, repeat_every_n: e.target.value })}
                  placeholder="Ex: 1 pour tous les jours/semaines"
                  min="1"
                  className="border-gray-300 focus:ring-blue-500"
                />
              </div>
              {newLesson.frequency === '2' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={newLesson.all_days}
                      onCheckedChange={(checked) => setNewLesson({ ...newLesson, all_days: !!checked })}
                    />
                    <label className="text-sm font-medium text-gray-700">Tous les jours de la semaine</label>
                  </div>
                  {!newLesson.all_days && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddDay}
                        className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un jour
                      </Button>
                      {newLesson.days.map((day, index) => (
                        <div key={index} className="flex items-center space-x-2 border p-2 rounded-md">
                          <Select
                            value={day.day.toString()}
                            onValueChange={(value) => handleUpdateDay(index, 'day', parseInt(value))}
                          >
                            <SelectTrigger className="w-32 border-gray-300 focus:ring-blue-500">
                              <SelectValue placeholder="Jour" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS_OF_WEEK.map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="time"
                            placeholder="Début"
                            value={day.start_time}
                            onChange={(e) => handleUpdateDay(index, 'start_time', e.target.value)}
                            className="w-24 border-gray-300 focus:ring-blue-500"
                          />
                          <Input
                            type="time"
                            placeholder="Fin"
                            value={day.end_time}
                            onChange={(e) => handleUpdateDay(index, 'end_time', e.target.value)}
                            className="w-24 border-gray-300 focus:ring-blue-500"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveDay(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          <Button
            onClick={handleAddLesson}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            Ajouter
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 space-y-6 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">
              <Calendar className="inline mr-2 h-5 w-5" />
              Calendrier des leçons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                messages={{
                  next: 'Suivant',
                  previous: 'Précédent',
                  today: 'Aujourd’hui',
                  month: 'Mois',
                  week: 'Semaine',
                  day: 'Jour',
                }}
                culture="fr"
                selectable
                onSelectSlot={handleCalendarSelectSlot}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lessons Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-blue-700">
              <Calendar className="inline mr-2 h-5 w-5" />
              Liste des leçons
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                Nouvelle leçon
              </Button>
              <a href="/dashboard/lessons" className="text-blue-600 hover:underline text-sm flex items-center">
                Rafraîchir
              </a>
            </div>
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
                Aucune leçon disponible.
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
                      <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
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
                          await axios.post(
                            `${API_URL}/recommendations/accept/${rec.id}`,
                            {},
                            {
                              headers: {
                                'X-school-id': '2',
                                'X-scholastic-period-id': '1',
                                'X-resource-data-type': 'original',
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          setRecommendations(recommendations.filter((r) => r.id !== rec.id));
                         toast.success("Recommandation accepter avec succes")
                        } catch (err) {
                          setError("Échec de l'acceptation de la recommandation.");
                          toast.error("Echec validation de recommandation")
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
    </div>
  );
}