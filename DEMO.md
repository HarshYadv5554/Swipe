# Demo Instructions for AI Interview Assistant

## Quick Start Demo

### 1. Start the Application
```bash
cd swipe-interview-app
npm start
```

The application will open at `http://localhost:3000`

### 2. Interviewee Flow Demo

#### Step 1: Upload Resume
1. Navigate to the "Interviewee" tab
2. Click "Upload Resume (PDF/DOCX)"
3. Upload a sample resume (PDF or DOCX format)
4. The AI will extract Name, Email, and Phone from the resume
5. If any information is missing, fill in the required fields
6. Click "Complete Profile" to proceed

#### Step 2: Start Interview
1. Once profile is complete, the interview will automatically start
2. You'll see 6 questions with progressive difficulty:
   - Questions 1-2: Easy (20 seconds each)
   - Questions 3-4: Medium (60 seconds each)  
   - Questions 5-6: Hard (120 seconds each)
3. Answer each question within the time limit
4. Use the "Pause" button if needed
5. The system auto-submits when time runs out

#### Step 3: View Results
1. After completing all 6 questions, you'll see your final score
2. An AI-generated summary will be created
3. Switch to the "Interviewer" tab to see your results

### 3. Interviewer Dashboard Demo

#### Step 1: View Candidates
1. Navigate to the "Interviewer" tab
2. See all candidates with their scores and status
3. Use the search bar to find specific candidates
4. Sort by Name, Score, or Date

#### Step 2: View Detailed Results
1. Click "View Details" on any candidate
2. See complete interview history:
   - All questions and answers
   - Individual scores for each question
   - Time spent on each question
   - AI-generated summary
   - Final score and percentage

### 4. Data Persistence Demo

#### Test Session Recovery
1. Start an interview (upload resume and begin)
2. Answer 1-2 questions
3. Close the browser or refresh the page
4. Reopen the application
5. You'll see a "Welcome Back" modal
6. Choose to resume the interview or start fresh

### 5. Key Features to Highlight

#### AI-Powered Features
- **Resume Processing**: Automatic extraction of candidate information
- **Question Generation**: Dynamic, role-specific questions
- **Answer Scoring**: AI evaluation of responses
- **Summary Generation**: Comprehensive candidate assessments

#### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Real-time Timers**: Visual countdown for each question
- **Progress Tracking**: Clear indication of interview progress
- **Error Handling**: Graceful handling of file uploads and API errors

#### Data Management
- **Local Persistence**: All data saved locally
- **Session Recovery**: Resume interrupted interviews
- **Search & Filter**: Easy candidate management
- **Detailed Analytics**: Comprehensive performance insights

## Demo Script for Video Recording

### Introduction (30 seconds)
"Welcome to the AI Interview Assistant. This application provides a complete interview experience with AI-powered question generation, real-time scoring, and comprehensive candidate management."

### Resume Upload Demo (1 minute)
1. Show the clean, modern interface
2. Upload a sample resume
3. Demonstrate AI extraction of candidate information
4. Show missing field collection process

### Interview Flow Demo (2 minutes)
1. Start the interview process
2. Show the timer functionality
3. Demonstrate pause/resume capability
4. Show auto-submission when time expires
5. Complete the full 6-question flow

### Interviewer Dashboard Demo (1 minute)
1. Switch to interviewer view
2. Show candidate list with scores
3. Demonstrate search and sort functionality
4. Open detailed candidate view
5. Show AI-generated summary and analytics

### Data Persistence Demo (30 seconds)
1. Show session recovery feature
2. Demonstrate data persistence across browser sessions

## Technical Highlights

- **React 18** with TypeScript for type safety
- **Redux Toolkit** for state management
- **Ant Design** for modern UI components
- **Google Gemini API** for AI functionality
- **Redux Persist** for data persistence
- **Responsive design** for all devices

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Notes

- Fast initial load with code splitting
- Efficient state management with Redux
- Optimized API calls with error handling
- Responsive design for all screen sizes
