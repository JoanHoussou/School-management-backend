import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  List, 
  Progress, 
  Typography, 
  Avatar, 
  Tag, 
  Calendar, 
  Timeline,
  Badge,
  Tooltip,
  Space,
  Button,
  Divider,
  Empty
} from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  BookOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  MailOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// Export des menuItems pour les autres composants
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

const WIDGET_SIZES = {
  quickStats: {
    height: 140,
    xs: 24,
    sm: 12,
    lg: 6
  },
  staffOverview: {
    height: 520,
    xs: 24,
    lg: 16
  },
  classStats: {
    height: 400,
    xs: 24,
    lg: 12,
    xl: 6
  },
  distribution: {
    height: 360,
    xs: 24,
    lg: 14
  },
  performance: {
    height: 520,
    xs: 24,
    lg: 8
  },
  calendar: {
    height: 480,
    xs: 24,
    lg: 12
  }
};

const CLASS_LEVELS = [
  { key: '6eme', label: '6ème' },
  { key: '5eme', label: '5ème' },
  { key: '4eme', label: '4ème' },
  { key: '3eme', label: '3ème' },
  { key: '2nde', label: 'Seconde' },
  { key: '1ere', label: 'Première' },
  { key: 'Tle', label: 'Terminale' }
];

const initialSchoolStats = {
  totalStudents: 450,
  totalTeachers: 35,
  totalClasses: 15,
  averageAttendance: 95,
  recentActivities: [
    {
      type: 'Inscription',
      description: 'Nouvel élève inscrit en 3ème A',
      date: '2024-03-18 10:30'
    },
    {
      type: 'Académique',
      description: 'Mise à jour de l\'emploi du temps 4ème B',
      date: '2024-03-18 09:15'
    },
    {
      type: 'Personnel',
      description: 'Nouveau professeur de mathématiques',
      date: '2024-03-17 14:20'
    }
  ],
  classDistribution: [
    { name: '6ème', count: 120, percentage: 27 },
    { name: '5ème', count: 115, percentage: 26 },
    { name: '4ème', count: 110, percentage: 24 },
    { name: '3ème', count: 105, percentage: 23 }
  ],
  quickStats: {
    todayAttendance: 97,
    pendingRequests: 12,
    activeTeachers: 32,
    ongoingClasses: 8
  },
  recentMessages: [
    {
      id: 1,
      sender: "Marie Dupont",
      subject: "Question sur l'emploi du temps",
      time: "Il y a 10 min",
      priority: "high"
    }
  ],
  classDetails: {
    '6eme': {
      totalStudents: 120,
      classes: [
        { name: '6ème A', students: 30, performance: 85, attendance: 98 },
        { name: '6ème B', students: 31, performance: 82, attendance: 95 },
        { name: '6ème C', students: 29, performance: 88, attendance: 97 },
        { name: '6ème D', students: 30, performance: 80, attendance: 96 }
      ],
      bestClass: '6ème C'
    },
    '5eme': {
      totalStudents: 115,
      classes: [/* ... */],
      bestClass: '5ème B'
    },
    '4eme': {
      totalStudents: 110,
      classes: [/* ... */],
      bestClass: '4ème A'
    },
    '3eme': {
      totalStudents: 105,
      classes: [/* ... */],
      bestClass: '3ème C'
    }
  },
  staffStats: {
    teachers: {
      total: 35,
      bySubject: [
        { subject: 'Mathématiques', count: 6 },
        { subject: 'Français', count: 5 },
        { subject: 'Histoire-Géo', count: 4 },
        { subject: 'Sciences', count: 5 },
        { subject: 'Anglais', count: 4 },
        { subject: 'EPS', count: 3 },
        { subject: 'Autres', count: 8 }
      ],
      present: 32,
      absent: 3
    },
    administration: {
      total: 8,
      present: 8
    },
    support: {
      total: 12,
      present: 11
    }
  },
  academicStats: {
    averagesByLevel: {
      '6eme': 14.5,
      '5eme': 13.8,
      '4eme': 14.2,
      '3eme': 13.9
    },
    successRate: {
      '6eme': 92,
      '5eme': 90,
      '4eme': 88,
      '3eme': 85
    },
    topPerformingSubjects: [
      { subject: 'Mathématiques', average: 14.8 },
      { subject: 'EPS', average: 15.2 },
      { subject: 'Anglais', average: 14.5 }
    ]
  },
  facilities: {
    classrooms: {
      total: 25,
      inUse: 18
    },
    specialRooms: {
      labs: 3,
      computerRooms: 2,
      library: 1,
      gymnasium: 1
    },
    maintenance: {
      pending: 2,
      inProgress: 1
    }
  },
  upcomingEvents: [
    {
      id: 1,
      title: "Conseil de classe 3ème A",
      date: "2024-03-20",
      time: "14:00",
      location: "Salle 102",
      type: "academic"
    },
    {
      id: 2,
      title: "Réunion parents-profs",
      date: "2024-03-22",
      time: "17:00",
      location: "Gymnase",
      type: "meeting"
    },
    {
      id: 3,
      title: "Sortie scolaire 5ème B",
      date: "2024-03-25",
      time: "08:30",
      location: "Musée d'Histoire",
      type: "activity"
    }
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [schoolStats, setSchoolStats] = useState(initialSchoolStats);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const LEVELS_PER_PAGE = 4;
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);
  const performanceLevels = Object.entries(schoolStats.academicStats.averagesByLevel);

  const handleNext = () => {
    setCurrentLevelIndex(prev => 
      Math.min(prev + LEVELS_PER_PAGE, CLASS_LEVELS.length - LEVELS_PER_PAGE)
    );
  };

  const handlePrev = () => {
    setCurrentLevelIndex(prev => Math.max(prev - LEVELS_PER_PAGE, 0));
  };

  const handleNextPerformance = () => {
    setCurrentPerformanceIndex(prev =>
      Math.min(prev + 1, performanceLevels.length - 1)
    );
  };

  const handleManageClasses = () => {
    navigate('/admin/classes');
  };

  const handlePrevPerformance = () => {
    setCurrentPerformanceIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="dashboard-container">
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

        {/* Quick Stats Row */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col {...WIDGET_SIZES.quickStats}>
            <Card className="stat-card attendance-card" hoverable>
              <Statistic
                title={
                  <Space>
                    <TeamOutlined />
                    <span>Présence aujourd'hui</span>
                  </Space>
                }
                value={schoolStats.quickStats.todayAttendance}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={schoolStats.quickStats.todayAttendance} 
                showInfo={false}
                strokeColor="#52c41a"
                size="small"
              />
            </Card>
          </Col>

          <Col {...WIDGET_SIZES.quickStats}>
            <Card className="stat-card students-card" hoverable>
              <Statistic
                title={
                  <Space>
                    <UsergroupAddOutlined />
                    <span>Total Élèves</span>
                  </Space>
                }
                value={schoolStats.totalStudents}
                prefix={<RiseOutlined />}
              />
              <Text type="secondary">+12 ce mois</Text>
            </Card>
          </Col>

          <Col {...WIDGET_SIZES.quickStats}>
            <Card className="stat-card teachers-card" hoverable>
              <Statistic
                title={
                  <Space>
                    <BookOutlined />
                    <span>Classes actives</span>
                  </Space>
                }
                value={schoolStats.quickStats.ongoingClasses}
                suffix={`/${schoolStats.totalClasses}`}
              />
              <Badge status="processing" text="En cours" />
            </Card>
          </Col>

          <Col {...WIDGET_SIZES.quickStats}>
            <Card className="stat-card requests-card" hoverable>
              <Statistic
                title={
                  <Space>
                    <FileTextOutlined />
                    <span>Demandes en attente</span>
                  </Space>
                }
                value={schoolStats.quickStats.pendingRequests}
                valueStyle={{ color: '#faad14' }}
              />
              <Text type="warning">Nécessite votre attention</Text>
            </Card>
          </Col>
        </Row>

        {/* Vue d'ensemble des niveaux */}
        <div className="levels-section">
          <div className="levels-header">
            <Title level={4}>Vue d'ensemble des niveaux</Title>
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
              const data = schoolStats.classDetails[level.key];
              return (
                <Col key={level.key} {...WIDGET_SIZES.classStats}>
                  <Card 
                    className="level-card"
                    title={
                      <div className="level-header">
                        <span>Classes de {level.label}</span>
                        {data?.bestClass && (
                          <Tag color="gold">Meilleure : {data.bestClass}</Tag>
                        )}
                      </div>
                    }
                  >
                    {data ? (
                      <div className="level-stats">
                        <Statistic
                          title="Total élèves"
                          value={data.totalStudents}
                          prefix={<TeamOutlined />}
                        />
                        <div className="classes-grid">
                          {data.classes.map(classe => (
                            <div key={classe.name} className="class-item">
                              <div className="class-header">
                                <Text strong>{classe.name}</Text>
                                <Badge count={classe.students} style={{ backgroundColor: '#52c41a' }} />
                              </div>
                              <Tooltip title="Performance">
                                <Progress percent={classe.performance} size="small" />
                              </Tooltip>
                              <Tooltip title="Assiduité">
                                <Progress
                                  percent={classe.attendance}
                                  size="small"
                                  strokeColor="#1890ff"
                                />
                              </Tooltip>
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
          <Col {...WIDGET_SIZES.staffOverview}>
            <Card 
              className="staff-card"
              title={
                <div className="staff-header">
                  <Space>
                    <TeamOutlined />
                    <span>Personnel de l'établissement</span>
                  </Space>
                  <Tag color="processing">{schoolStats.staffStats.teachers.total + schoolStats.staffStats.administration.total + schoolStats.staffStats.support.total} membres</Tag>
                </div>
              }
            >
              <div className="staff-overview">
                {/* Section Enseignants */}
                <div className="staff-section teachers-section">
                  <div className="section-header">
                    <Title level={5}>Corps enseignant</Title>
                    <Badge 
                      count={`${schoolStats.staffStats.teachers.present}/${schoolStats.staffStats.teachers.total}`} 
                      style={{ backgroundColor: '#52c41a' }} 
                    />
                  </div>
                  
                  <div className="presence-indicator">
                    <Progress 
                      percent={Math.round((schoolStats.staffStats.teachers.present/schoolStats.staffStats.teachers.total)*100)}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#52c41a',
                      }}
                      size="small"
                    />
                    <Text type="secondary">Taux de présence</Text>
                  </div>

                  <Divider orientation="left" plain>Par matière</Divider>
                  
                  <div className="subjects-grid">
                    {schoolStats.staffStats.teachers.bySubject.map(subject => (
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

                {/* Section Personnel administratif et de soutien */}
                <div className="staff-section support-section">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card className="staff-type-card admin-card">
                        <Statistic
                          title="Administration"
                          value={schoolStats.staffStats.administration.present}
                          suffix={`/${schoolStats.staffStats.administration.total}`}
                          prefix={<UserOutlined />}
                        />
                        <Progress 
                          percent={100} 
                          size="small" 
                          strokeColor="#1890ff"
                          showInfo={false}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className="staff-type-card support-card">
                        <Statistic
                          title="Personnel de soutien"
                          value={schoolStats.staffStats.support.present}
                          suffix={`/${schoolStats.staffStats.support.total}`}
                          prefix={<UserOutlined />}
                        />
                        <Progress 
                          percent={92} 
                          size="small" 
                          strokeColor="#52c41a"
                          showInfo={false}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>

          <Col {...WIDGET_SIZES.performance}>
            <Card 
              className="performance-card"
              title={
                <div className="performance-header-container">
                  <Space>
                    <BarChartOutlined />
                    <span>Performance académique</span>
                  </Space>
                  <Space>
                    <Button 
                      icon={<LeftOutlined />} 
                      size="small"
                      onClick={handlePrevPerformance}
                      disabled={currentPerformanceIndex === 0}
                    />
                    <Button 
                      icon={<RightOutlined />} 
                      size="small"
                      onClick={handleNextPerformance}
                      disabled={currentPerformanceIndex >= performanceLevels.length - 1}
                    />
                  </Space>
                </div>
              }
            >
              <div className="performance-content">
                {(() => {
                  const [level, average] = performanceLevels[currentPerformanceIndex];
                  return (
                    <div key={level} className="level-performance active">
                      <div className="current-level">
                        <Title level={4}>Niveau {CLASS_LEVELS.find(l => l.key === level)?.label}</Title>
                        <Tag color="blue">Moyenne : {average}/20</Tag>
                      </div>
                      
                      <div className="performance-metrics">
                        <Progress 
                          percent={average * 5} 
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          showInfo={false}
                        />
                        <div className="performance-details">
                          <Space direction="vertical">
                            <Text>Taux de réussite : {schoolStats.academicStats.successRate[level]}%</Text>
                            <Tag color={schoolStats.academicStats.successRate[level] > 85 ? 'success' : 'processing'}>
                              {schoolStats.academicStats.successRate[level] > 85 ? 'Excellent' : 'Bon'}
                            </Tag>
                          </Space>
                        </div>
                      </div>

                      <Divider orientation="left" plain>Meilleures matières</Divider>
                      
                      <div className="top-subjects">
                        {schoolStats.academicStats.topPerformingSubjects.map(subject => (
                          <div key={subject.subject} className="top-subject-item">
                            <Text strong>{subject.subject}</Text>
                            <Space>
                              <Text type="success">{subject.average}/20</Text>
                              <Progress 
                                percent={subject.average * 5} 
                                size="small" 
                                strokeColor="#52c41a"
                                showInfo={false}
                                style={{ width: 80 }}
                              />
                            </Space>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          </Col>
        </Row>

        <style>{`
          .dashboard-container {
            padding: 24px;
            min-height: 100vh;
            background: white;
          }

          .dashboard-header {
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            border-bottom: 1px solid #f0f0f0;
          }

          .stat-card {
            height: ${WIDGET_SIZES.quickStats.height}px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            background: white;
            border: 1px solid #f0f0f0;
          }

          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .attendance-card {
            background: white;
            border-left: 4px solid #52c41a;
          }

          .students-card {
            background: white;
            border-left: 4px solid #1890ff;
          }

          .teachers-card {
            background: white;
            border-left: 4px solid #faad14;
          }

          .requests-card {
            background: white;
            border-left: 4px solid #ff4d4f;
          }

          .level-card {
            height: 100%;
            background: white;
            border: 1px solid #f0f0f0;
          }

          .class-item {
            padding: 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #f0f0f0;
            transition: all 0.3s ease;
          }

          .class-item:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }

          .staff-card, .performance-card {
            background: white;
            border: 1px solid #f0f0f0;
          }

          .inner-stat-card {
            background: white;
            border-left: 4px solid #52c41a;
          }

          .subject-card {
            background: white;
            border: 1px solid #f0f0f0;
            transition: all 0.3s ease;
          }

          .subject-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          }

          .ant-card-head {
            border-bottom: 1px solid #f0f0f0;
            padding: 0 16px;
          }

          .ant-card-head-title {
            font-weight: 600;
          }

          .ant-statistic-title {
            color: #8c8c8c;
          }

          .ant-progress {
            margin-bottom: 0;
          }

          .dashboard-grid {
            margin-top: 24px;
          }

          .mt-4 {
            margin-top: 16px;
          }

          @media (max-width: 768px) {
            .dashboard-container {
              padding: 16px;
            }
          }

          .levels-section {
            margin-bottom: 24px;
          }

          .levels-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 8px;
          }

          .levels-header .ant-btn {
            border-radius: 50%;
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .levels-header .ant-btn:disabled {
            background: #f5f5f5;
            border-color: #d9d9d9;
          }

          .level-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .classes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-top: 16px;
          }

          .class-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .staff-card {
            height: 100%;
            background: linear-gradient(to bottom, #ffffff, #fafafa);
          }

          .staff-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .staff-overview {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .staff-section {
            padding: 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .presence-indicator {
            margin: 16px 0;
          }

          .subjects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
          }

          .subject-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            background: #fafafa;
            border-radius: 6px;
            transition: all 0.3s ease;
          }

          .subject-item:hover {
            background: #f0f0f0;
            transform: translateY(-2px);
          }

          .subject-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1890ff;
            color: white;
            border-radius: 6px;
            font-weight: bold;
          }

          .subject-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .staff-type-card {
            background: white;
            border: none;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            transition: all 0.3s ease;
          }

          .staff-type-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .admin-card {
            border-left: 4px solid #1890ff;
          }

          .support-card {
            border-left: 4px solid #52c41a;
          }

          .ant-divider-inner-text {
            font-size: 12px;
            color: #8c8c8c;
          }

          .performance-card {
            height: 100%;
          }

          .level-performance {
            padding: 16px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .level-performance:last-child {
            border-bottom: none;
          }

          .performance-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .performance-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
          }

          .top-subjects {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 16px;
          }

          .top-subject-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: #fafafa;
            border-radius: 6px;
          }

          .top-subject-item:hover {
            background: #f0f0f0;
          }

          .main-content {
            margin-top: 24px;
          }

          .performance-card .ant-progress {
            margin-bottom: 0;
            width: 100%;
          }

          .performance-header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .performance-content {
            position: relative;
            min-height: 400px;
          }

          .current-level {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .level-performance.active {
            animation: fadeIn 0.3s ease-in-out;
          }

          .performance-metrics {
            background: #fafafa;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .top-subject-item {
            padding: 12px;
            border-radius: 6px;
            background: white;
            margin-bottom: 8px;
            border: 1px solid #f0f0f0;
            transition: all 0.3s ease;
          }

          .top-subject-item:hover {
            transform: translateX(4px);
            border-color: #1890ff;
          }

          .notification-btn {
            background: white;
            border: 1px solid #f0f0f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .notification-btn:hover {
            background: #f5f5f5;
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard; 