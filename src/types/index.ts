export interface Monitor {
  id: number;
  create_who_fullname: string;
  update_who_fullname: string;
  status: number;
  start_date: string | null;
  end_date: string;
}

export interface Lesson {
  id: number;
  monitor: Monitor;
  denomination: string;
  description: string;
  course_id: number;
  serve_id: number;
  local_id: number;
  origin_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'Planifiée' | 'Confirmée' | 'En attente';
}

export interface Recommendation {
  id: number;
  course: string;
  suggestedTime: string;
  local: string;
}

export interface Day {
  day: number;
  start_time: string;
  end_time: string;
}