import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Input, Progress, Space, message } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTimeRemaining, addAnswer, completeInterview, pauseInterview, resumeInterview, setCurrentQuestion, updateCandidate } from '../store/slice';
import { GeminiService } from '../services/geminiService';
import { ResumeService } from '../services/resumeService';
import { Answer, Question } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentQuestion, timeRemaining, isPaused, isInterviewActive } = useSelector((state: RootState) => state.interview);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isInterviewActive && currentCandidate && currentCandidate.currentQuestionIndex < 6 && !currentQuestion) {
      generateNextQuestion();
    }
  }, [isInterviewActive, currentCandidate, currentQuestion]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isInterviewActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
      }, 1000);
    }
    
    if (timeRemaining === 0 && currentQuestion) {
      handleSubmitAnswer();
    }
    
    return () => clearInterval(interval);
  }, [timeRemaining, isPaused, isInterviewActive, currentQuestion]);

  const generateNextQuestion = async () => {
    if (!currentCandidate) return;
    
    const questionNumber = currentCandidate.currentQuestionIndex + 1;
    let difficulty: 'easy' | 'medium' | 'hard';
    
    if (questionNumber <= 2) difficulty = 'easy';
    else if (questionNumber <= 4) difficulty = 'medium';
    else difficulty = 'hard';
    
    const timeLimit = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;
    
    try {
      console.log('Generating question:', questionNumber, difficulty);
      
      // Get resume text for personalized questions
      let resumeText = currentCandidate.resumeText || '';
      if (!resumeText && currentCandidate.resume) {
        try {
          resumeText = await ResumeService.extractTextFromFile(currentCandidate.resume);
        } catch (error) {
          console.error('Failed to extract resume text:', error);
        }
      }
      
      const questionText = await GeminiService.generateQuestion(difficulty, questionNumber, resumeText);
      console.log('Generated question:', questionText);
      
      const question: Question = {
        id: `q${questionNumber}`,
        question: questionText,
        difficulty,
        timeLimit
      };
      
      dispatch(setCurrentQuestion(question));
      dispatch(setTimeRemaining(timeLimit));
      console.log('Question set in store');
    } catch (error) {
      console.error('Failed to generate question:', error);
      message.error('Failed to generate question');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !currentCandidate) return;
    
    setIsSubmitting(true);
    try {
      const score = await GeminiService.scoreAnswer(
        currentQuestion.question,
        currentAnswer || 'No answer provided',
        currentQuestion.difficulty
      );
      
      const answer: Answer = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: currentAnswer || 'No answer provided',
        difficulty: currentQuestion.difficulty,
        score,
        timeSpent: currentQuestion.timeLimit - timeRemaining,
        timestamp: new Date()
      };
      
      dispatch(addAnswer(answer));
      setCurrentAnswer('');
      
      if (currentCandidate.currentQuestionIndex + 1 >= 6) {
        await completeInterviewProcess();
      } else {
        generateNextQuestion();
      }
    } catch (error) {
      message.error('Failed to process answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInterviewProcess = async () => {
    if (!currentCandidate) return;
    
    const totalScore = currentCandidate.answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
    const summary = await GeminiService.generateSummary({
      ...currentCandidate,
      finalScore: totalScore
    });
    
    // Update the candidate with final results
    const updatedCandidate = {
      ...currentCandidate,
      finalScore: totalScore,
      summary,
      interviewStatus: 'completed' as const,
      endTime: new Date()
    };
    
    // Update the candidate in the store
    dispatch(updateCandidate(updatedCandidate));
    dispatch(completeInterview());
    message.success('Interview completed! Check the Interviewer tab for results.');
  };

  const handlePause = () => {
    dispatch(pauseInterview());
  };

  const handleResume = () => {
    dispatch(resumeInterview());
  };

  if (!isInterviewActive || !currentCandidate || !currentQuestion) {
    return (
      <Card>
        <Title level={3}>Interview Chat</Title>
        <Text>Start an interview to begin the chat session.</Text>
      </Card>
    );
  }

  const progress = ((currentCandidate.currentQuestionIndex + 1) / 6) * 100;
  const difficultyColors = { easy: '#52c41a', medium: '#faad14', hard: '#ff4d4f' };

  return (
    <Card className="interview-chat">
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Interview Chat</Title>
        <Progress percent={progress} status="active" />
        <Text>Question {currentCandidate.currentQuestionIndex + 1} of 6</Text>
      </div>

      <Card 
        size="small" 
        style={{ 
          marginBottom: 16, 
          borderLeft: `4px solid ${difficultyColors[currentQuestion.difficulty]}` 
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ textTransform: 'capitalize' }}>
              {currentQuestion.difficulty} Question
            </Text>
            <Text type="secondary">
              Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </Text>
          </div>
          <Text>{currentQuestion.question}</Text>
        </Space>
      </Card>

      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          disabled={isSubmitting}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {isPaused ? (
              <Button 
                icon={<PlayCircleOutlined />} 
                onClick={handleResume}
                type="primary"
              >
                Resume
              </Button>
            ) : (
              <Button 
                icon={<PauseCircleOutlined />} 
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
          </Space>
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmitAnswer}
            loading={isSubmitting}
            disabled={!currentAnswer.trim()}
          >
            Submit Answer
          </Button>
        </div>
      </Space>
    </Card>
  );
};
