export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume?: File;
  resumeText?: string;
  interviewStatus: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Answer[];
  finalScore?: number;
  summary?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
  timeSpent: number;
  timestamp: Date;
}

export interface Question {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface AppState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  isInterviewActive: boolean;
  currentQuestion: Question | null;
  timeRemaining: number;
  isPaused: boolean;
  showWelcomeBackModal: boolean;
}
