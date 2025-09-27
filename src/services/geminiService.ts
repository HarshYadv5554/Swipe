import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDbmaQXVRIJ57XgSo9y09kHMgjeVH5e3aI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  static async generateQuestion(difficulty: 'easy' | 'medium' | 'hard', questionNumber: number, resumeText?: string): Promise<string> {
    // If no resume text, use default questions
    if (!resumeText) {
      const defaultQuestions = {
        easy: [
          "What is the difference between let, const, and var in JavaScript? Explain with examples.",
          "What is JSX in React and how does it work?"
        ],
        medium: [
          "Explain the React component lifecycle methods and when to use them.",
          "What is state management in React? Compare useState, useReducer, and Context API."
        ],
        hard: [
          "Design a scalable architecture for a real-time chat application using React and Node.js. Include database design, API structure, and real-time communication.",
          "Explain the Virtual DOM in React and how it improves performance. Compare it with direct DOM manipulation."
        ]
      };
      
      const questionIndex = (questionNumber - 1) % 2;
      return defaultQuestions[difficulty][questionIndex];
    }

    // Generate personalized questions based on resume content
    const prompt = `Based on this candidate's resume, generate a ${difficulty} level technical interview question for a full-stack developer position. This is question ${questionNumber} of 6.

Resume content: ${resumeText.substring(0, 1500)}

Requirements:
- The question should be relevant to the technologies mentioned in their resume
- For ${difficulty} level: ${difficulty === 'easy' ? 'basic concepts and fundamentals' : difficulty === 'medium' ? 'intermediate concepts and practical applications' : 'advanced concepts, system design, and architecture'}
- Make it specific to their experience level and background
- Focus on technologies they claim to know
- Return only the question text, no additional formatting
- Make the question practical and relevant to their background

Generate a personalized question:`;

    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: GEMINI_API_KEY
        }
      });

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`Generated personalized ${difficulty} question ${questionNumber}:`, content);
      return content || this.getDefaultQuestion(difficulty, questionNumber);
    } catch (error) {
      console.error('Error generating personalized question:', error);
      return this.getDefaultQuestion(difficulty, questionNumber);
    }
  }

  static getDefaultQuestion(difficulty: 'easy' | 'medium' | 'hard', questionNumber: number): string {
    const defaultQuestions = {
      easy: [
        "What is the difference between let, const, and var in JavaScript? Explain with examples.",
        "What is JSX in React and how does it work?"
      ],
      medium: [
        "Explain the React component lifecycle methods and when to use them.",
        "What is state management in React? Compare useState, useReducer, and Context API."
      ],
      hard: [
        "Design a scalable architecture for a real-time chat application using React and Node.js. Include database design, API structure, and real-time communication.",
        "Explain the Virtual DOM in React and how it improves performance. Compare it with direct DOM manipulation."
      ]
    };
    
    const questionIndex = (questionNumber - 1) % 2;
    return defaultQuestions[difficulty][questionIndex];
  }

  static async extractResumeData(resumeText: string): Promise<{name?: string, email?: string, phone?: string}> {
    console.log('Extracting data from resume text:', resumeText.substring(0, 200));
    
    // Enhanced regex patterns
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    const nameRegex = /^([A-Z][a-z]+ [A-Z][a-z]+)/m;
    
    const emailMatch = resumeText.match(emailRegex);
    const phoneMatch = resumeText.match(phoneRegex);
    const nameMatch = resumeText.match(nameRegex);
    
    let extractedData = {
      name: nameMatch ? nameMatch[1].trim() : undefined,
      email: emailMatch ? emailMatch[1].trim() : undefined,
      phone: phoneMatch ? phoneMatch[0].trim() : undefined
    };
    
    console.log('Regex extraction result:', extractedData);
    
    // Always try AI extraction for better results
    const prompt = `Extract the following information from this resume text. Return only a JSON object with name, email, and phone fields. If any field is not found, set it to null.

Resume text: ${resumeText.substring(0, 2000)}

Return format:
{
  "name": "Full Name",
  "email": "email@domain.com", 
  "phone": "phone number"
}`;

    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: GEMINI_API_KEY
        }
      });

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('Gemini response:', content);
      
      try {
        // Clean the response
        const cleanedContent = content.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedContent);
        console.log('AI parsed data:', parsed);
        
        // Use AI results if they have data, otherwise use regex
        if (parsed.name || parsed.email || parsed.phone) {
          return parsed;
        } else {
          return extractedData;
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Try to extract data manually from the response
        const nameMatch = content.match(/name["\s]*:["\s]*([^",}]+)/i);
        const emailMatch = content.match(/email["\s]*:["\s]*([^",}]+)/i);
        const phoneMatch = content.match(/phone["\s]*:["\s]*([^",}]+)/i);
        
        const aiExtracted = {
          name: nameMatch ? nameMatch[1].trim().replace(/['"]/g, '') : undefined,
          email: emailMatch ? emailMatch[1].trim().replace(/['"]/g, '') : undefined,
          phone: phoneMatch ? phoneMatch[1].trim().replace(/['"]/g, '') : undefined
        };
        
        // Use AI results if they have data, otherwise use regex
        if (aiExtracted.name || aiExtracted.email || aiExtracted.phone) {
          return aiExtracted;
        } else {
          return extractedData;
        }
      }
    } catch (error) {
      console.error('Error extracting resume data:', error);
      return extractedData; // Return regex results as fallback
    }
  }

  static async scoreAnswer(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<number> {
    // Check for negative responses first
    const negativeResponses = ['i dont know', 'i don\'t know', 'no', 'nothing', 'idk', 'not sure', 'no idea', 'can\'t answer', 'cannot answer', 'no answer', 'blank'];
    const answerLower = answer.toLowerCase().trim();
    
    if (negativeResponses.some(negative => answerLower.includes(negative)) || answer.length < 5) {
      console.log(`Negative or very short answer detected: "${answer}" - Score: 1`);
      return 1;
    }
    
    // Use AI for comprehensive analysis
    const prompt = `You are an expert technical interviewer. Rate this interview answer on a scale of 1-10.

Question: "${question}"
Answer: "${answer}"
Difficulty Level: ${difficulty}

Evaluation Criteria:
- Technical Accuracy: Is the information correct?
- Completeness: Does it address the question fully?
- Depth of Understanding: Shows real knowledge vs memorization
- Practical Application: Can they apply concepts?
- Communication: Clear and well-structured response

Scoring Guide:
- 1-2: No answer, "I don't know", completely wrong, or irrelevant
- 3-4: Very basic, minimal understanding, major gaps
- 5-6: Some knowledge but incomplete, partially correct
- 7-8: Good understanding, mostly correct, some technical depth
- 9-10: Excellent, comprehensive, technically accurate, shows expertise

For ${difficulty} level questions, consider:
- Easy: Basic concepts, definitions, simple examples
- Medium: Practical applications, comparisons, problem-solving
- Hard: System design, architecture, advanced concepts, optimization

Return only a number between 1-10.`;

    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: GEMINI_API_KEY
        }
      });

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('AI scoring response:', content);
      
      // Extract number from response
      const scoreMatch = content.match(/(\d+)/);
      let score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
      
      // Ensure score is between 1-10
      score = Math.max(1, Math.min(10, score));
      
      console.log(`AI scored answer for ${difficulty} question:`, { 
        question: question.substring(0, 50) + '...', 
        answer: answer.substring(0, 50) + '...', 
        score,
        fullAnswer: answer
      });
      
      return score;
    } catch (error) {
      console.error('Error in AI scoring:', error);
      
      // Enhanced fallback scoring
      let score = 3; // Start lower for fallback
      
      // Length-based scoring
      if (answer.length < 10) score = 1;
      else if (answer.length < 30) score = 2;
      else if (answer.length < 50) score = 3;
      else if (answer.length < 100) score = 5;
      else if (answer.length < 200) score = 7;
      else score = 8;
      
      // Technical keyword bonus
      const techKeywords = ['javascript', 'react', 'component', 'function', 'variable', 'api', 'database', 'algorithm', 'optimization', 'architecture'];
      const keywordMatches = techKeywords.filter(keyword => answerLower.includes(keyword)).length;
      score += Math.min(keywordMatches * 0.5, 2);
      
      return Math.max(1, Math.min(10, Math.round(score)));
    }
  }

  static async generateSummary(candidate: any): Promise<string> {
    const totalScore = candidate.finalScore || 0;
    const percentage = Math.round((totalScore / 60) * 100);
    
    // Create detailed analysis of answers
    const answersAnalysis = candidate.answers.map((answer: any, index: number) => 
      `Q${index + 1} (${answer.difficulty}): "${answer.answer.substring(0, 100)}..." - Score: ${answer.score}/10`
    ).join('\n');
    
    const prompt = `Analyze this candidate's interview performance and provide a comprehensive summary.

Candidate: ${candidate.name}
Total Score: ${totalScore}/60 (${percentage}%)

Question Analysis:
${answersAnalysis}

Provide a detailed summary (3-4 sentences) including:
1. Overall performance assessment
2. Specific strengths and weaknesses observed
3. Technical knowledge gaps
4. Recommended next steps for improvement

Be specific about what the candidate did well and what needs improvement.`;

    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: GEMINI_API_KEY
        }
      });

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('AI summary response:', content);
      return content || `${candidate.name} completed the interview with a score of ${totalScore}/60 (${percentage}%).`;
    } catch (error) {
      console.error('Error generating AI summary:', error);
      
      // Fallback to simple summary
      let performance = '';
      let strengths = '';
      let areas = '';
      
      if (percentage >= 80) {
        performance = 'excellent';
        strengths = 'strong technical knowledge and comprehensive understanding';
        areas = 'continue building on current expertise';
      } else if (percentage >= 60) {
        performance = 'good';
        strengths = 'solid foundation and good problem-solving skills';
        areas = 'focus on advanced concepts and practical applications';
      } else if (percentage >= 40) {
        performance = 'fair';
        strengths = 'basic understanding of concepts';
        areas = 'need more practice with core technologies and real-world applications';
      } else {
        performance = 'needs improvement';
        strengths = 'willingness to learn';
        areas = 'require significant study of fundamental concepts and hands-on practice';
      }
      
      return `${candidate.name} showed ${performance} performance with a score of ${totalScore}/60 (${percentage}%). The candidate demonstrates ${strengths}. Recommended next steps: ${areas}.`;
    }
  }
}
