import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button, Upload as AntUpload, message, Card, Typography, Space } from 'antd';
import { ResumeService } from '../services/resumeService';
import { GeminiService } from '../services/geminiService';
import { Candidate } from '../types';

const { Title, Text } = Typography;

interface ResumeUploadProps {
  onCandidateCreated: (candidate: Candidate) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onCandidateCreated }) => {
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<{name?: string, email?: string, phone?: string} | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleUpload = async (file: File) => {
    const validation = ResumeService.validateFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }

    setUploading(true);
    try {
      const text = await ResumeService.extractTextFromFile(file);
      console.log('Processing file with extracted text:', text.substring(0, 300));
      
      // Check if it's a PDF file that needs manual input
      if (text.includes('PDF file detected') || text.includes('PDF content extraction not available')) {
        setExtractedData({ name: undefined, email: undefined, phone: undefined });
        setMissingFields(['name', 'email', 'phone']);
        message.info('PDF file uploaded. Please provide your information below.');
      } else {
        // For DOCX files, try to extract data using AI
        console.log('Processing DOCX file with text length:', text.length);
        try {
          const data = await GeminiService.extractResumeData(text);
          console.log('AI extracted data:', data);
          
          setExtractedData(data);
          
          const missing = [];
          if (!data.name) missing.push('name');
          if (!data.email) missing.push('email');
          if (!data.phone) missing.push('phone');
          
          setMissingFields(missing);
          
          if (missing.length === 0) {
            const candidate: Candidate = {
              id: Date.now().toString(),
              name: data.name!,
              email: data.email!,
              phone: data.phone!,
              resume: file,
              resumeText: text, // Store resume text for personalized questions
              interviewStatus: 'not_started',
              currentQuestionIndex: 0,
              answers: [],
            };
            console.log('Creating candidate with resume text length:', text.length);
            onCandidateCreated(candidate);
            message.success('Resume processed successfully!');
          } else {
            message.warning(`Please provide missing information: ${missing.join(', ')}`);
          }
        } catch (aiError) {
          console.error('AI extraction failed:', aiError);
          // Fallback to manual input
          setExtractedData({ name: undefined, email: undefined, phone: undefined });
          setMissingFields(['name', 'email', 'phone']);
          message.warning('AI extraction failed. Please provide your information manually.');
        }
      }
    } catch (error) {
      message.error('Failed to process resume');
      console.error(error);
    } finally {
      setUploading(false);
    }

    return false; // Prevent default upload
  };

  const handleFormSubmit = () => {
    const candidate: Candidate = {
      id: Date.now().toString(),
      name: formData.name || extractedData?.name || '',
      email: formData.email || extractedData?.email || '',
      phone: formData.phone || extractedData?.phone || '',
      resumeText: '', // No resume text for manual entry
      interviewStatus: 'not_started',
      currentQuestionIndex: 0,
      answers: [],
    };
    console.log('Creating candidate:', candidate);
    onCandidateCreated(candidate);
    message.success('Candidate profile created successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="resume-upload">
      <Title level={3}>Upload Resume</Title>
      <Text type="secondary">Upload your resume to start the interview process</Text>
      
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 16 }}>
        <AntUpload
          accept=".pdf,.docx"
          beforeUpload={handleUpload}
          showUploadList={false}
          disabled={uploading}
        >
          <Button 
            icon={<Upload />} 
            size="large" 
            loading={uploading}
            style={{ width: '100%' }}
          >
            {uploading ? 'Processing...' : 'Upload Resume (PDF/DOCX)'}
          </Button>
        </AntUpload>

        {extractedData && (
          <Card size="small" title="Extracted Information">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Name: </Text>
                <Text>{extractedData.name || 'Not found'}</Text>
              </div>
              <div>
                <Text strong>Email: </Text>
                <Text>{extractedData.email || 'Not found'}</Text>
              </div>
              <div>
                <Text strong>Phone: </Text>
                <Text>{extractedData.phone || 'Not found'}</Text>
              </div>
            </Space>
          </Card>
        )}

        {missingFields.length > 0 && (
          <Card size="small" title="Missing Information" style={{ borderColor: '#ff4d4f' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
                <AlertCircle size={16} style={{ marginRight: 8 }} />
                <Text>Please provide the following information:</Text>
              </div>
              
              {missingFields.includes('name') && (
                <div>
                  <Text strong>Name: </Text>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '4px 8px', marginTop: 4 }}
                  />
                </div>
              )}
              
              {missingFields.includes('email') && (
                <div>
                  <Text strong>Email: </Text>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{ width: '100%', padding: '4px 8px', marginTop: 4 }}
                  />
                </div>
              )}
              
              {missingFields.includes('phone') && (
                <div>
                  <Text strong>Phone: </Text>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{ width: '100%', padding: '4px 8px', marginTop: 4 }}
                  />
                </div>
              )}
              
              <Button 
                type="primary" 
                onClick={handleFormSubmit}
                disabled={missingFields.some(field => !formData[field as keyof typeof formData])}
              >
                Complete Profile
              </Button>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};
