/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  User,
  GraduationCap,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Target,
  Award,
  Users,
  MapPin,
  BookOpen,
  Activity,
  BarChart,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { mockStudents } from "../students";
import { Student } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FLASK_AI_API_URL =
  process.env.FLASK_AI_API_URL || "http://localhost:8000";

interface PredictionResponse {
  confidence: number;
  model_type: string;
  predicted_category: number;
  probabilities: {
    "0": number;
    "1": number;
    "2": number;
  };
  recommendations: string[];
  timestamp: string;
}

const calculateMetrics = (student: Student) => {
  const currentDate = new Date();
  const enrollmentDate = new Date(student.first_enrollment_date);

  const enrollment_duration = Math.round(
    (currentDate.getTime() - enrollmentDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  const mark_average =
    student.grades.length > 0
      ? student.grades.reduce((a, b) => a + b, 0) / student.grades.length
      : 0;

  const total_school_days = 180;
  const absence_percentage =
    (student.absences.length / total_school_days) * 100;
  const justified_absences = student.absences.filter(
    (abs) => abs.justified
  ).length;
  const absence_justified_percentage =
    student.absences.length > 0
      ? (justified_absences / student.absences.length) * 100
      : 0;
  const attendance_rate = 100 - absence_percentage;

  const has_behavior_issues = student.disciplinary_notes.length > 0 ? 1 : 0;

  const total_homework = student.homework_submissions.length;
  const submitted_homework = student.homework_submissions.filter(
    (hw) => hw.submitted
  ).length;
  const submission_rate =
    total_homework > 0 ? (submitted_homework / total_homework) * 100 : 0;

  const graded_homework = student.homework_submissions.filter(
    (hw) => hw.submitted && hw.grade
  );
  const correctness_rate =
    graded_homework.length > 0
      ? graded_homework.reduce((sum, hw) => sum + (hw.grade || 0), 0) /
        graded_homework.length
      : 0;

  const teacher_comment_score =
    student.teacher_comments.length > 0
      ? student.teacher_comments.reduce(
          (sum, comment) => sum + comment.score,
          0
        ) / student.teacher_comments.length
      : 3;

  const extra_activity_count = student.extra_activities.length;
  const activity_score = extra_activity_count * 2;

  const evaluation_count = student.grades.length;
  const is_available = 1;
  const course_count = student.course_subjects?.length || 5;
  const course_difficulty = Math.ceil(course_count / 2);

  return {
    enrollment_duration,
    mark: mark_average,
    average_grade: mark_average,
    evaluation_count,
    absence_percentage,
    absence_justified_percentage,
    attendance_rate,
    has_behavior_issues,
    submission_rate,
    correctness_rate,
    teacher_comment_score,
    is_available,
    extra_activity_count,
    activity_score,
    course_count,
    course_difficulty,
  };
};

export default function StudentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = Cookies.get("token");
  const [student, setStudent] = useState<Student | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const foundStudent = mockStudents.find(
          (s) => s.id === parseInt(id as string)
        );
        if (foundStudent) {
          setStudent(foundStudent);
          const calculatedMetrics = calculateMetrics(foundStudent);
          setMetrics(calculatedMetrics);
          toast.success(
            `Détails de ${foundStudent.first_name} ${foundStudent.last_name} chargés avec succès.`
          );
        } else {
          setError("Étudiant non trouvé.");
          toast.error("Étudiant non trouvé.");
        }
      } catch (err) {
        setError("Échec du chargement des détails de l'étudiant.");
        toast.error("Échec du chargement des détails de l'étudiant.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, token]);

  const handlePredict = async () => {
    if (!student || !metrics) return;
    setPredicting(true);
    try {
      const predictionData = {
        sex: student.sex === "M" ? 1 : 0,
        enrollment_duration: metrics.enrollment_duration,
        mark: metrics.mark,
        average_grade: metrics.average_grade,
        evaluation_count: metrics.evaluation_count,
        absence_percentage: metrics.absence_percentage,
        absence_justified_percentage: metrics.absence_justified_percentage,
        has_behavior_issues: metrics.has_behavior_issues,
        submission_rate: metrics.submission_rate,
        correctness_rate: metrics.correctness_rate,
        teacher_comment_score: metrics.teacher_comment_score,
        is_available: metrics.is_available,
        extra_activity_count: metrics.extra_activity_count,
        activity_score: metrics.activity_score,
        parent_occupation_level: student.parent_occupation_level || 2,
        address_level: student.address_level || 2,
        course_count: metrics.course_count,
        course_difficulty: metrics.course_difficulty,
        age: student.age || 12,
      };

      const response = await axios.post(
        `${FLASK_AI_API_URL}/predict`,
        predictionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction(response.data);
      toast.success(
        `Prédiction effectuée : ${getStatusText(
          response.data.predicted_category
        )}`
      );
    } catch (err) {
      console.error("Erreur de prédiction:", err);
      setError("Échec de la prédiction. Veuillez réessayer.");
      toast.error("Échec de la prédiction.");
    } finally {
      setPredicting(false);
    }
  };

  const getStatusColor = (category: number) => {
    switch (category) {
      case 1:
        return "bg-emerald-500";
      case 2:
        return "bg-amber-500";
      case 0:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (category: number) => {
    switch (category) {
      case 1:
        return "À haut potentiel";
      case 2:
        return "Moyen";
      case 0:
        return "À risque";
      default:
        return "Non évalué";
    }
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
          <p className="text-slate-600 font-medium">
            Chargement des données...
          </p>
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
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="group flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
            onClick={() => router.push("/dashboard/students")}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à la liste</span>
          </Button>

          {student && (
            <Button
              onClick={handlePredict}
              disabled={predicting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Brain className="w-4 h-4 mr-2" />
              {predicting ? "Analyse en cours..." : "Analyser le potentiel"}
            </Button>
          )}
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!student ? (
          <Card className="bg-white/70 backdrop-blur border-0 shadow-xl">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Aucun étudiant trouvé</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden"
              >
                <Card className="bg-white/70 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span>Analyse du potentiel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(
                          prediction.predicted_category
                        )}`}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Catégorie prédite
                        </h3>
                        <p className="text-slate-600">
                          {getStatusText(prediction.predicted_category)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Score de confiance
                      </h3>
                      <p className="text-lg font-semibold text-slate-900">
                        {(prediction.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Date de prédiction
                      </h3>
                      <p className="text-lg text-slate-900">
                        {new Date(prediction.timestamp).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Recommandations
                      </h3>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card className="bg-white/70 backdrop-blur border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {student.first_name} {student.last_name}
                    </h1>
                    <p className="text-blue-100">
                      {student.classroom} • {student.registration_number}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Âge</p>
                      <p className="font-semibold">{student.age} ans</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Sexe</p>
                      <p className="font-semibold">
                        {student.sex === "M" ? "Masculin" : "Féminin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Inscription</p>
                      <p className="font-semibold">
                        {new Date(
                          student.first_enrollment_date
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Parents</p>
                      <p className="font-semibold text-sm">
                        {student.parent1_name}
                      </p>
                      {student.parent2_name && (
                        <p className="font-semibold text-sm">
                          {student.parent2_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">
                          Moyenne générale
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {metrics.average_grade.toFixed(1)}/20
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">
                          Taux de présence
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {metrics.attendance_rate.toFixed(1)}%
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Devoirs rendus</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {metrics.submission_rate.toFixed(1)}%
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">
                          Activités extra
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {metrics.extra_activity_count}
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    <span>Notes récentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.grades.slice(-5).map((grade, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-slate-50 rounded"
                      >
                        <span className="text-sm text-slate-600">
                          Évaluation {student.grades.length - 4 + index}
                        </span>
                        <span className="font-semibold">{grade}/20</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-red-500" />
                    <span>Absences récentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.absences.slice(-5).map((absence, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-slate-50 rounded"
                      >
                        <span className="text-sm text-slate-600">
                          {new Date(absence.date).toLocaleDateString("fr-FR")}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            absence.justified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {absence.justified ? "Justifiée" : "Non justifiée"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Activités extra-scolaires</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.extra_activities.map((activity, index) => (
                      <div
                        key={index}
                        className="p-2 bg-purple-50 rounded text-purple-800 font-medium"
                      >
                        {activity}
                      </div>
                    ))}
                    {student.extra_activities.length === 0 && (
                      <p className="text-slate-500 italic">
                        Aucune activité enregistrée
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span>Notes disciplinaires</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.disciplinary_notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-2 bg-red-50 rounded text-red-800 text-sm"
                      >
                        {note}
                      </div>
                    ))}
                    {student.disciplinary_notes.length === 0 && (
                      <p className="text-green-600 font-medium">
                        Aucune note disciplinaire
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span>Commentaires des professeurs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.teacher_comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < comment.score
                                  ? "text-amber-400 fill-current"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(comment.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-slate-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
