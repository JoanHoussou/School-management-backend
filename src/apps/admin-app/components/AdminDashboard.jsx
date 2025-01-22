import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Tag, 
  Badge,
  Space,
  Button,
  Divider,
  Empty,
  Spin,
  Alert
} from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  BookOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../../../shared/hooks/useDashboard';
import '../../../styles/admin/index.css';

const { Title, Text } = Typography;

// Menu items pour la navigation
export const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord'
  },
  {
    key: '/admin/users',
    icon: <TeamOutlined />,
    label: 'Utilisateurs'
  },
  {
    key: '/admin/academic',
    icon: <BookOutlined />,
    label: 'Gestion académique'
  },
  {
    key: '/admin/classes',
    icon: <UsergroupAddOutlined />,
    label: 'Classes'
  },
  {
    key: '/admin/reports',
    icon: <BarChartOutlined />,
    label: 'Rapports'
  }
];

const CLASS_LEVELS = [
  { key: '6eme', label: '6ème' },
  { key: '5eme', label: '5ème' },
  { key: '4eme', label: '4ème' },
  { key: '3eme', label: '3ème' }
];

const LEVELS_PER_PAGE = 4;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, error, data, refreshData } = useDashboard();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);

  const handleNext = () => {
    setCurrentLevelIndex(prev => 
      Math.min(prev + LEVELS_PER_PAGE, CLASS_LEVELS.length - LEVELS_PER_PAGE)
    );
  };

  const handlePrev = () => {
    setCurrentLevelIndex(prev => Math.max(prev - LEVELS_PER_PAGE, 0));
  };

  const handleNextPerformance = () => {
    if (data?.academicPerformance) {
      setCurrentPerformanceIndex(prev =>
        Math.min(prev + 1, Object.keys(data.academicPerformance.averagesByLevel).length - 1)
      );
    }
  };

  const handlePrevPerformance = () => {
    if (data?.academicPerformance) {
      setCurrentPerformanceIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const handleManageClasses = () => {
    navigate('/admin/classes');
  };

  if (error) {
    return (
      <AppLayout menuItems={menuItems}>
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={refreshData} type="primary">
              Réessayer
            </Button>
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout menuItems={menuItems}>
      <div className="dashboard-container">
        <Spin spinning={loading} tip="Chargement des données...">
          <div className="dashboard-header">
            <div className="flex justify-between items-center">
              <Title level={2}>Tableau de bord administrateur</Title>
              <Button
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={handleManageClasses}
              >
                Gérer les classes
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card attendance-card" hoverable>
                <Statistic
                  title={<Space><TeamOutlined />Présence aujourd&apos;hui</Space>}
                  value={data?.stats?.quickStats?.todayAttendance}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress 
                  percent={data?.stats?.quickStats?.todayAttendance} 
                  showInfo={false}
                  strokeColor="#52c41a"
                  size="small"
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card students-card" hoverable>
                <Statistic
                  title={<Space><UsergroupAddOutlined />Total Élèves</Space>}
                  value={data?.stats?.totalStudents}
                  prefix={<RiseOutlined />}
                />
                <Text type="secondary">
                  {data?.stats?.newStudentsThisMonth > 0 
                    ? `+${data.stats.newStudentsThisMonth} ce mois`
                    : 'Aucun nouvel élève ce mois-ci'}
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card teachers-card" hoverable>
                <Statistic
                  title={<Space><BookOutlined />Classes actives</Space>}
                  value={data?.stats?.quickStats?.ongoingClasses}
                  suffix={`/${data?.stats?.totalClasses}`}
                />
                <Badge status="processing" text="En cours" />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card requests-card" hoverable>
                <Statistic
                  title={<Space><FileTextOutlined />Demandes en attente</Space>}
                  value={data?.stats?.quickStats?.pendingRequests}
                  valueStyle={{ color: '#faad14' }}
                />
                <Text type="warning">Nécessite votre attention</Text>
              </Card>
            </Col>
          </Row>

          {/* Vue d'ensemble des niveaux */}
          <div className="levels-section">
            <div className="levels-header">
              <Title level={4}>Vue d&apos;ensemble des niveaux</Title>
              <Space>
                <Button 
                  icon={<LeftOutlined />} 
                  onClick={handlePrev}
                  disabled={currentLevelIndex === 0}
                />
                <Button 
                  icon={<RightOutlined />} 
                  onClick={handleNext}
                  disabled={currentLevelIndex >= CLASS_LEVELS.length - LEVELS_PER_PAGE}
                />
              </Space>
            </div>

            <Row gutter={[16, 16]} className="dashboard-grid">
              {CLASS_LEVELS.slice(currentLevelIndex, currentLevelIndex + LEVELS_PER_PAGE).map(level => {
                const levelData = data?.classesOverview?.[level.key];
                return (
                  <Col key={level.key} xs={24} sm={12} lg={6}>
                    <Card 
                      className="level-card"
                      title={
                        <div className="level-header">
                          <span>Classes de {level.label}</span>
                          {levelData?.bestClass && (
                            <Tag color="gold">Meilleure : {levelData.bestClass}</Tag>
                          )}
                        </div>
                      }
                    >
                      {levelData ? (
                        <div className="level-stats">
                          <Statistic
                            title="Total élèves"
                            value={levelData.totalStudents}
                            prefix={<TeamOutlined />}
                          />
                          <div className="classes-grid">
                            {levelData.classes.map(classe => (
                              <div key={classe.name} className="class-item">
                                <div className="class-header">
                                  <Text strong>{classe.name}</Text>
                                  <Badge count={classe.students} style={{ backgroundColor: '#52c41a' }} />
                                </div>
                                <Progress percent={classe.performance} size="small" />
                                <Progress
                                  percent={classe.attendance}
                                  size="small"
                                  strokeColor="#1890ff"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Empty description="Aucune donnée disponible" />
                      )}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Vue d'ensemble du personnel */}
          <Row gutter={[16, 16]} className="main-content">
            <Col xs={24} lg={16}>
              <Card className="staff-card">
                <div className="staff-overview">
                  <div className="staff-section">
                    <div className="section-header">
                      <Title level={5}>Corps enseignant</Title>
                      <Badge 
                        count={`${data?.staffOverview?.teachers.present}/${data?.staffOverview?.teachers.total}`} 
                        style={{ backgroundColor: '#52c41a' }} 
                      />
                    </div>
                    
                    <Progress 
                      percent={Math.round((data?.staffOverview?.teachers.present / data?.staffOverview?.teachers.total) * 100)}
                      strokeColor={{ from: '#108ee9', to: '#52c41a' }}
                      size="small"
                    />

                    <Divider orientation="left" plain>Par matière</Divider>
                    
                    <div className="subjects-grid">
                      {data?.staffOverview?.teachers.bySubject.map(subject => (
                        <div key={subject.subject} className="subject-item">
                          <div className="subject-icon">
                            {subject.subject[0]}
                          </div>
                          <div className="subject-info">
                            <Text strong>{subject.subject}</Text>
                            <Space>
                              <TeamOutlined />
                              <Text>{subject.count}</Text>
                            </Space>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="performance-card">
                <div className="performance-header">
                  <div className="performance-header-container">
                    <Space>
                      <BarChartOutlined />
                      <span>Performance académique</span>
                    </Space>
                    <Space>
                      <Button 
                        icon={<LeftOutlined />} 
                        onClick={handlePrevPerformance}
                        size="small"
                        disabled={currentPerformanceIndex === 0}
                      />
                      <Button 
                        icon={<RightOutlined />} 
                        onClick={handleNextPerformance}
                        size="small"
                        disabled={!data?.academicPerformance || currentPerformanceIndex >= Object.keys(data.academicPerformance.averagesByLevel).length - 1}
                      />
                    </Space>
                  </div>
                </div>
                <div className="performance-content">
                  {data?.academicPerformance && Object.entries(data.academicPerformance.averagesByLevel)
                    .slice(currentPerformanceIndex, currentPerformanceIndex + 1)
                    .map(([level, average]) => (
                      <div key={level} className="level-performance active">
                        <div className="current-level">
                          <Title level={4}>
                            Niveau {CLASS_LEVELS.find(l => l.key === level)?.label}
                          </Title>
                          <Tag color="blue">Moyenne : {average}/20</Tag>
                        </div>
                        
                        <div className="performance-metrics">
                          <Progress 
                            percent={average * 5}
                            strokeColor={{ from: '#108ee9', to: '#87d068' }}
                            showInfo={false}
                          />
                          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                            <Text>
                              Taux de réussite : {data.academicPerformance.successRate[level]}%
                            </Text>
                            <Tag color={data.academicPerformance.successRate[level] > 85 ? 'success' : 'processing'}>
                              {data.academicPerformance.successRate[level] > 85 ? 'Excellent' : 'Bon'}
                            </Tag>
                          </Space>
                        </div>
                      </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;