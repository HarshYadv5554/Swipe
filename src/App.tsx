import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { setShowWelcomeBackModal, startInterview, resetInterview, addCandidate } from './store/slice';
import { ResumeUpload } from './components/ResumeUpload';
import { InterviewChat } from './components/InterviewChat';
import { InterviewerDashboard } from './components/InterviewerDashboard';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { Tabs, Layout, Typography } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    candidates, 
    currentCandidate, 
    isInterviewActive, 
    showWelcomeBackModal 
  } = useSelector((state: RootState) => state.interview);
  
  const [activeTab, setActiveTab] = useState('interviewee');

  useEffect(() => {
    // Check for unfinished interviews on app load
    const unfinishedCandidate = candidates.find(
      c => c.interviewStatus === 'in_progress' || 
           (c.interviewStatus === 'not_started' && c.currentQuestionIndex > 0)
    );
    
    if (unfinishedCandidate) {
      dispatch(setShowWelcomeBackModal(true));
    }
  }, [candidates, dispatch]);

  const handleCandidateCreated = (candidate: any) => {
    console.log('Candidate created, starting interview:', candidate);
    dispatch(addCandidate(candidate));
    dispatch(startInterview(candidate));
    setActiveTab('interviewee');
  };

  const handleResumeInterview = () => {
    const unfinishedCandidate = candidates.find(
      c => c.interviewStatus === 'in_progress' || 
           (c.interviewStatus === 'not_started' && c.currentQuestionIndex > 0)
    );
    
    if (unfinishedCandidate) {
      dispatch(startInterview(unfinishedCandidate));
      dispatch(setShowWelcomeBackModal(false));
      setActiveTab('interviewee');
    }
  };

  const handleStartNew = () => {
    dispatch(resetInterview());
    dispatch(setShowWelcomeBackModal(false));
  };

  // Removed unused handleStartInterview function

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee
        </span>
      ),
      children: (
        <div>
          {!isInterviewActive ? (
            <ResumeUpload onCandidateCreated={handleCandidateCreated} />
          ) : (
            <InterviewChat />
          )}
        </div>
      ),
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <DashboardOutlined />
          Interviewer
        </span>
      ),
      children: <InterviewerDashboard />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            AI Interview Assistant
          </Title>
        </div>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Content>

      <WelcomeBackModal
        visible={showWelcomeBackModal}
        candidate={currentCandidate}
        onResume={handleResumeInterview}
        onStartNew={handleStartNew}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;