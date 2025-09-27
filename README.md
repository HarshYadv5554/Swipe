# 🎯 AI-Powered Interview Assistant

A comprehensive React application that conducts AI-powered interviews with resume parsing, personalized questions, and real-time scoring using Google Gemini AI.

## 🚀 Features

### 📋 **Resume Processing**
- **PDF & DOCX Support**: Upload resumes in PDF or DOCX format
- **AI-Powered Extraction**: Automatically extracts Name, Email, and Phone using Gemini AI
- **Smart Fallbacks**: Regex + AI extraction for maximum accuracy
- **Manual Input**: Option to manually enter missing information

### 🎤 **Intelligent Interview System**
- **Personalized Questions**: AI generates questions based on resume content
- **Dynamic Difficulty**: 2 Easy, 2 Medium, 2 Hard questions
- **Timed Sessions**: 20s (Easy), 60s (Medium), 120s (Hard)
- **Auto-Progression**: Automatic question advancement when time expires

### 📊 **Dual Interface**
- **Interviewee Tab**: Chat interface for candidates
- **Interviewer Tab**: Dashboard for HR/recruiters
- **Real-time Sync**: Both tabs stay synchronized

### 🧠 **AI-Powered Analysis**
- **Smart Scoring**: Gemini AI evaluates answers comprehensively
- **Detailed Feedback**: Specific strengths, weaknesses, and recommendations
- **Resume-Based Questions**: Questions tailored to candidate's experience
- **Technology-Focused**: Questions match candidate's skills

### 💾 **Data Persistence**
- **Redux + Redux Persist**: State management with local storage
- **Session Recovery**: "Welcome Back" modal for unfinished interviews
- **Progress Tracking**: Resume interviews from where you left off

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit, Redux Persist
- **UI Library**: Ant Design
- **AI Integration**: Google Gemini API
- **File Processing**: Mammoth (DOCX), FileReader API
- **Build Tool**: Create React App
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HarshYadv5554/Swipe.git
cd Swipe
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the development server**
```bash
npm start
```

The application will run on `http://localhost:3001`

## 📱 Usage

### For Candidates (Interviewee Tab)
1. **Upload Resume**: Upload your resume (PDF/DOCX)
2. **Verify Information**: Check extracted Name, Email, Phone
3. **Start Interview**: Begin the timed interview session
4. **Answer Questions**: Respond to AI-generated personalized questions
5. **View Results**: See your final score and detailed feedback

### For HR/Recruiters (Interviewer Tab)
1. **View Candidates**: See all candidates ordered by score
2. **Review Profiles**: Check candidate information and resume
3. **Analyze Performance**: View detailed AI-generated summaries
4. **Track Progress**: Monitor interview completion status

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### Customization
- **Question Count**: Modify in `src/services/geminiService.ts`
- **Timer Settings**: Adjust in `src/components/InterviewChat.tsx`
- **UI Theme**: Customize in `src/App.css`

## 📊 API Integration

### Google Gemini API
The application uses Google Gemini API for:
- **Resume Data Extraction**: Parse and extract candidate information
- **Question Generation**: Create personalized interview questions
- **Answer Scoring**: Evaluate candidate responses
- **Summary Generation**: Generate detailed performance analysis

### API Endpoints Used
- `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`

## 🎯 Key Features Explained

### Resume Parsing
```typescript
// Dual extraction method for maximum accuracy
const extractedData = await GeminiService.extractResumeData(resumeText);
```

### Personalized Questions
```typescript
// Generate questions based on resume content
const question = await GeminiService.generateQuestion(
  difficulty, 
  questionNumber, 
  resumeText
);
```

### AI Scoring
```typescript
// Comprehensive answer evaluation
const score = await GeminiService.scoreAnswer(question, answer, difficulty);
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add `REACT_APP_GEMINI_API_KEY`
3. **Deploy**: Automatic deployment on every push to main branch

### Manual Deployment
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

## 📈 Performance

- **Build Size**: ~500KB gzipped
- **Load Time**: < 2 seconds
- **AI Response**: 1-3 seconds per request
- **Browser Support**: Chrome, Firefox, Safari, Edge

## 🔒 Security

- **API Key**: Stored as environment variable
- **Data Privacy**: All data stored locally in browser
- **No Server**: Client-side only application
- **Secure API**: HTTPS-only API calls

## 🐛 Troubleshooting

### Common Issues

1. **Resume Not Parsing**
   - Check file format (PDF/DOCX only)
   - Verify Gemini API key is set
   - Check browser console for errors

2. **Questions Not Appearing**
   - Ensure resume text is extracted
   - Check Gemini API quota
   - Verify network connection

3. **Scoring Issues**
   - Check API key validity
   - Verify answer format
   - Check console for error messages

### Debug Mode
Enable detailed logging by opening browser console and checking for:
- Resume extraction logs
- Question generation logs
- API response logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent question generation and scoring
- **Ant Design** for beautiful UI components
- **React Team** for the amazing framework
- **Redux Team** for state management

## 📞 Support

For support, email [your-email@domain.com] or create an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**