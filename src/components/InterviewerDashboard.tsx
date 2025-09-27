import React, { useState } from 'react';
import { Card, Table, Typography, Button, Space, Tag, Modal, Input, Select, Row, Col, Statistic } from 'antd';
import { EyeOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Candidate } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;

export const InterviewerDashboard: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.interview);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<'name' | 'finalScore' | 'endTime'>('finalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'finalScore':
          aValue = a.finalScore || 0;
          bValue = b.finalScore || 0;
          break;
        case 'endTime':
          aValue = a.endTime?.getTime() || 0;
          bValue = b.endTime?.getTime() || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'interviewStatus',
      key: 'interviewStatus',
      render: (status: string) => {
        const color = status === 'completed' ? 'green' : status === 'in_progress' ? 'orange' : 'default';
        return <Tag color={color}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'finalScore',
      render: (score: number) => score ? `${score}/60` : 'N/A',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCandidate(record);
            setIsModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // Removed unused handleSort function

  const completedCandidates = candidates.filter(c => c.interviewStatus === 'completed');
  const averageScore = completedCandidates.length > 0 
    ? completedCandidates.reduce((sum, c) => sum + (c.finalScore || 0), 0) / completedCandidates.length 
    : 0;

  return (
    <div>
      <Title level={2}>Interviewer Dashboard</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Candidates" value={candidates.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Completed Interviews" value={completedCandidates.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Average Score" value={averageScore.toFixed(1)} suffix="/60" />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Candidates</Title>
          <Space>
            <Search
              placeholder="Search candidates..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={sortField}
              onChange={setSortField}
              style={{ width: 120 }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="finalScore">Score</Select.Option>
              <Select.Option value="endTime">Date</Select.Option>
            </Select>
            <Button
              icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Interview Details - ${selectedCandidate?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Name:</Text>
                  <br />
                  <Text>{selectedCandidate.name}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Email:</Text>
                  <br />
                  <Text>{selectedCandidate.email}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Phone:</Text>
                  <br />
                  <Text>{selectedCandidate.phone}</Text>
                </Col>
              </Row>
            </Card>

            {selectedCandidate.finalScore !== undefined && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Final Score" value={selectedCandidate.finalScore} suffix="/60" />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Percentage" 
                      value={((selectedCandidate.finalScore / 60) * 100).toFixed(1)} 
                      suffix="%" 
                    />
                  </Col>
                </Row>
              </Card>
            )}

            {selectedCandidate.summary && (
              <Card size="small" title="AI Summary" style={{ marginBottom: 16 }}>
                <Text>{selectedCandidate.summary}</Text>
              </Card>
            )}

            <Card size="small" title="Question & Answer Details">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedCandidate.answers.map((answer, index) => (
                  <Card key={answer.questionId} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>Question {index + 1}</Text>
                        <Space>
                          <Tag color={getDifficultyColor(answer.difficulty)}>
                            {answer.difficulty.toUpperCase()}
                          </Tag>
                          <Tag color="blue">Score: {answer.score}/10</Tag>
                        </Space>
                      </div>
                      <Text strong>Q:</Text>
                      <Text>{answer.question}</Text>
                      <Text strong>A:</Text>
                      <Text>{answer.answer}</Text>
                      <Text type="secondary">
                        Time spent: {answer.timeSpent}s | 
                        Submitted: {answer.timestamp.toLocaleString()}
                      </Text>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};
