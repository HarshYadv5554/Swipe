# AI-Powered Interview Assistant

A comprehensive React application that serves as an AI-powered interview assistant, featuring both interviewee and interviewer interfaces with real-time synchronization.

## Features

### 🎯 Core Functionality
- **Resume Upload & Processing**: Support for PDF and DOCX files with AI-powered data extraction
- **Smart Data Collection**: Automatically extracts Name, Email, and Phone from resumes
- **Missing Field Handling**: Interactive chatbot prompts for missing information
- **Timed Interview Flow**: 6 questions with progressive difficulty (2 Easy → 2 Medium → 2 Hard)
- **Real-time Scoring**: AI-powered answer evaluation and scoring
- **Dual Interface**: Separate tabs for Interviewee and Interviewer experiences

### ⏱️ Interview System
- **Progressive Difficulty**: Easy (20s), Medium (60s), Hard (120s) time limits
- **Auto-submission**: Automatic answer submission when time expires
- **Pause/Resume**: Ability to pause and resume interviews
- **Progress Tracking**: Real-time progress indicators and question tracking

### 📊 Interviewer Dashboard
- **Candidate Management**: View all candidates with scores and summaries
- **Detailed Analytics**: Individual candidate performance breakdowns
- **Search & Sort**: Advanced filtering and sorting capabilities
- **AI Summaries**: Comprehensive candidate performance summaries

### 💾 Data Persistence
- **Local Storage**: All data persists locally using Redux Persist
- **Session Recovery**: "Welcome Back" modal for unfinished interviews
- **State Management**: Comprehensive Redux store for all application state

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Framework**: Ant Design
- **AI Integration**: Google Gemini API
- **File Processing**: PDF-parse, Mammoth (for DOCX)
- **Styling**: CSS3 with responsive design

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swipe-interview-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

### For Interviewees
1. Navigate to the "Interviewee" tab
2. Upload your resume (PDF or DOCX)
3. Complete any missing information if prompted
4. Start the interview and answer 6 progressively difficult questions
5. View your results and AI-generated summary

### For Interviewers
1. Navigate to the "Interviewer" tab
2. View all candidates with their scores and status
3. Click "View Details" to see complete interview history
4. Use search and sort features to analyze candidate performance

## API Configuration

The application uses Google Gemini API for AI functionality. The API key is configured in `src/services/geminiService.ts`.

## Project Structure

```
src/
├── components/          # React components
│   ├── ResumeUpload.tsx
│   ├── InterviewChat.tsx
│   ├── InterviewerDashboard.tsx
│   └── WelcomeBackModal.tsx
├── services/           # API and utility services
│   ├── geminiService.ts
│   └── resumeService.ts
├── store/             # Redux store configuration
│   ├── store.ts
│   └── slice.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── App.tsx            # Main application component
```

## Key Features Implementation

### Resume Processing
- Supports PDF and DOCX file formats
- AI-powered extraction of candidate information
- Validation and error handling for file uploads

### Interview Flow
- Dynamic question generation using AI
- Progressive difficulty levels
- Real-time timer with auto-submission
- Pause/resume functionality

### Data Persistence
- Redux Persist for state management
- Local storage for data persistence
- Session recovery for interrupted interviews

### AI Integration
- Google Gemini API for question generation
- AI-powered answer scoring
- Automatic summary generation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Demo

A live demo is available at: [Demo URL]

## Video Demo

A 2-5 minute demo video showcasing the application features is available at: [Video URL]