import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, Candidate, Answer, Question } from '../types';

const initialState: AppState = {
  candidates: [],
  currentCandidate: null,
  isInterviewActive: false,
  currentQuestion: null,
  timeRemaining: 0,
  isPaused: false,
  showWelcomeBackModal: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Candidate>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.currentCandidate = action.payload;
    },
    startInterview: (state, action: PayloadAction<Candidate>) => {
      state.currentCandidate = action.payload;
      state.isInterviewActive = true;
      state.isPaused = false;
      // Update the candidate's interview status
      const candidateIndex = state.candidates.findIndex(c => c.id === action.payload.id);
      if (candidateIndex !== -1) {
        state.candidates[candidateIndex].interviewStatus = 'in_progress';
      }
    },
    pauseInterview: (state) => {
      state.isPaused = true;
    },
    resumeInterview: (state) => {
      state.isPaused = false;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.currentCandidate) {
        state.currentCandidate.answers.push(action.payload);
        state.currentCandidate.currentQuestionIndex += 1;
      }
    },
    completeInterview: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.interviewStatus = 'completed';
        state.currentCandidate.endTime = new Date();
        state.isInterviewActive = false;
        state.currentQuestion = null;
        state.timeRemaining = 0;
      }
    },
    setShowWelcomeBackModal: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBackModal = action.payload;
    },
    resetInterview: (state) => {
      state.isInterviewActive = false;
      state.currentQuestion = null;
      state.timeRemaining = 0;
      state.isPaused = false;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  setCurrentCandidate,
  startInterview,
  pauseInterview,
  resumeInterview,
  setCurrentQuestion,
  setTimeRemaining,
  addAnswer,
  completeInterview,
  setShowWelcomeBackModal,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
