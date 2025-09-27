import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Candidate } from '../types';

const { Title, Text } = Typography;

interface WelcomeBackModalProps {
  visible: boolean;
  candidate: Candidate | null;
  onResume: () => void;
  onStartNew: () => void;
}

export const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  visible,
  candidate,
  onResume,
  onStartNew
}) => {
  if (!candidate) return null;

  return (
    <Modal
      title="Welcome Back!"
      open={visible}
      onCancel={onStartNew}
      footer={[
        <Button key="new" onClick={onStartNew}>
          Start New Interview
        </Button>,
        <Button key="resume" type="primary" icon={<PlayCircleOutlined />} onClick={onResume}>
          Resume Interview
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        </div>
        
        <div>
          <Title level={4}>Hello {candidate.name}!</Title>
          <Text>
            You have an interview in progress. You were on question {candidate.currentQuestionIndex + 1} of 6.
          </Text>
        </div>

        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6 }}>
          <Text strong>Interview Progress:</Text>
          <br />
          <Text>Questions answered: {candidate.currentQuestionIndex}</Text>
          <br />
          <Text>Status: {candidate.interviewStatus.replace('_', ' ').toUpperCase()}</Text>
          {candidate.startTime && (
            <>
              <br />
              <Text>Started: {candidate.startTime.toLocaleString()}</Text>
            </>
          )}
        </div>

        <Text type="secondary">
          You can either resume your current interview or start a new one.
        </Text>
      </Space>
    </Modal>
  );
};
