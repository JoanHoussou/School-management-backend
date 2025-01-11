import { 
  Card, 
  Row, 
  Col, 
  List, 
  Badge, 
  Calendar, 
  Typography, 
  Statistic, 
  Progress, 
  Avatar, 
  Tag, 
  Tooltip,
  Button,
  Dropdown,
  Space,
  Divider,
  Select
} from 'antd';
import { 
  DashboardOutlined, 
  BookOutlined, 
  CheckSquareOutlined,
  ScheduleOutlined,
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  EllipsisOutlined,
  SettingOutlined,
  FilterOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  StarOutlined,
  StarFilled,
  FileTextOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Area } from '@ant-design/plots';

// Configurez dayjs pour utiliser le français
dayjs.locale('fr');

const { Title, Text } = Typography;
const { Option } = Select;

export const menuItems = [
  {
    key: '/teacher',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord'
  },
  {
    key: '/teacher/assignments',
    icon: <BookOutlined />,
    label: 'Devoirs'
  },
  {
    key: '/teacher/course',
    icon: <FileTextOutlined />,
    label: 'Cours'
  },
  {
    key: '/teacher/classes',
    icon: <TeamOutlined />,
    label: 'Classes'
  },
  {
    key: '/teacher/schedule',
    icon: <ScheduleOutlined />,
    label: 'Emploi du temps'
  },
  {
    key: '/teacher/messages',
    icon: <MessageOutlined />,
    label: 'Messages'
  }
];

const TeacherDashboard = () => {
  const teacherData = {
    teacher: {
      name: "M. Martin",
      subject: "Mathématiques",
      totalStudents: 77,
      todayClasses: 3,
      pendingGrades: 25,
      pendingAssignments: 2,
      unreadMessages: 3
    },
    todaySchedule: [
      { 
        time: '08:30-10:30', 
        class: '3ème A', 
        room: 'Salle 201', 
        type: 'Cours',
        chapter: {
          number: 5,
          title: 'Les fonctions dérivées',
          progress: 60,
          nextTopic: 'Étude des variations',
          lastSession: 'Règles de dérivation'
        }
      },
      { 
        time: '10:30-12:30', 
        class: '4ème B', 
        room: 'Salle 102', 
        type: 'TD',
        chapter: {
          number: 4,
          title: 'Théorème de Pythagore',
          progress: 75,
          nextTopic: 'Exercices d\'application',
          lastSession: 'Démonstration du théorème'
        }
      },
      { 
        time: '14:30-16:30', 
        class: '3ème C', 
        room: 'Salle 201', 
        type: 'TP',
        chapter: {
          number: 6,
          title: 'Géométrie dans l\'espace',
          progress: 40,
          nextTopic: 'Sections de solides',
          lastSession: 'Perspective cavalière'
        }
      }
    ],
    classes: [
      { 
        id: 1, 
        name: '3ème A', 
        students: 25,
        averageGrade: 14.5,
        attendance: 96,
        nextEvaluation: '2024-03-25',
        pendingGrades: 12,
        lastClass: '2024-03-18',
        progression: 75 // progression dans le programme
      },
      // ... autres classes
    ],
    upcomingDeadlines: [
      {
        type: 'evaluation',
        class: '3ème A',
        title: 'Contrôle Chapitre 5',
        date: '2024-03-25',
        status: 'À préparer'
      },
      {
        type: 'grades',
        class: '4ème B',
        title: 'Notes du devoir maison',
        date: '2024-03-22',
        status: 'À rendre'
      },
      {
        type: 'report',
        class: 'Toutes',
        title: 'Bulletins trimestriels',
        date: '2024-03-30',
        status: 'À compléter'
      }
    ],
    alerts: [
      {
        type: 'warning',
        message: '5 élèves en difficulté en 3ème A',
        action: 'Voir les détails'
      },
      {
        type: 'info',
        message: 'Conseil de classe le 28 mars',
        action: 'Voir agenda'
      }
    ],
    teacherRating: {
      average: 4.2,
      total: 45,
      distribution: {
        5: 20,
        4: 15,
        3: 7,
        2: 2,
        1: 1
      },
      recentFeedback: [
        "Explications très claires",
        "Cours intéressants",
        "Bon prof"
      ]
    },
    classesAnalytics: {
      rankings: [
        { 
          class: '3ème A',
          averageGrade: 14.5,
          attendance: 96,
          participation: 85,
          trend: 'up',
          lastMonth: 14.2,
          progression: 78
        },
        { 
          class: '4ème B',
          averageGrade: 13.8,
          attendance: 94,
          participation: 80,
          trend: 'stable',
          lastMonth: 13.7,
          progression: 72
        },
        { 
          class: '3ème C',
          averageGrade: 12.9,
          attendance: 92,
          participation: 75,
          trend: 'down',
          lastMonth: 13.2,
          progression: 65
        }
      ],
      monthlyProgress: [
        { month: 'Sept', '3ème A': 12.5, '4ème B': 11.8, '3ème C': 11.2 },
        { month: 'Oct', '3ème A': 13.2, '4ème B': 12.5, '3ème C': 11.8 },
        { month: 'Nov', '3ème A': 13.8, '4ème B': 13.1, '3ème C': 12.2 },
        { month: 'Déc', '3ème A': 14.1, '4ème B': 13.4, '3ème C': 12.5 },
        { month: 'Jan', '3ème A': 14.3, '4ème B': 13.6, '3ème C': 12.8 },
        { month: 'Fév', '3ème A': 14.5, '4ème B': 13.8, '3ème C': 12.9 }
      ]
    }
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="dashboard-container">
        {/* En-tête avec alertes */}
        <div className="dashboard-header">
          <div>
            <Title level={2} className="!mb-0">Tableau de bord</Title>
            <Text type="secondary">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
          </div>
          <Space>
            {teacherData.alerts.map((alert, index) => (
              <Tag 
                key={index}
                icon={alert.type === 'warning' ? <WarningOutlined /> : <InfoCircleOutlined />}
                color={alert.type === 'warning' ? 'warning' : 'processing'}
                className="alert-tag"
              >
                {alert.message}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Statistiques rapides en avant */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card highlight">
              <div className="stat-icon-bg">
                <TeamOutlined />
              </div>
              <Statistic
                title={<Text className="stat-title">Total Élèves</Text>}
                value={teacherData.totalStudents}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              />
              <Progress 
                percent={100} 
                showInfo={false} 
                strokeColor="#1890ff"
                className="stat-progress"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card highlight">
              <div className="stat-icon-bg">
                <ScheduleOutlined />
              </div>
              <Statistic
                title={<Text className="stat-title">Cours aujourd'hui</Text>}
                value={teacherData.todayClasses}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
              <Progress 
                percent={75} 
                showInfo={false} 
                strokeColor="#52c41a"
                className="stat-progress"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card highlight">
              <div className="stat-icon-bg">
                <BookOutlined />
              </div>
              <Statistic
                title={<Text className="stat-title">Devoirs à corriger</Text>}
                value={teacherData.pendingAssignments}
                valueStyle={{ color: '#faad14', fontSize: '28px' }}
              />
              <Progress 
                percent={40} 
                showInfo={false} 
                strokeColor="#faad14"
                className="stat-progress"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card highlight">
              <div className="stat-icon-bg">
                <MessageOutlined />
              </div>
              <Statistic
                title={<Text className="stat-title">Messages non lus</Text>}
                value={teacherData.unreadMessages}
                valueStyle={{ color: '#ff4d4f', fontSize: '28px' }}
              />
              <Progress 
                percent={25} 
                showInfo={false} 
                strokeColor="#ff4d4f"
                className="stat-progress"
              />
            </Card>
          </Col>
        </Row>

        {/* Widget Cours d'aujourd'hui - Version compacte */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              title={
                <div className="card-title">
                  <ScheduleOutlined className="card-icon" />
                  <span>Cours d'aujourd'hui</span>
                </div>
              }
              className="today-schedule-card"
              bordered={false}
            >
              <List
                itemLayout="horizontal"
                dataSource={teacherData.todaySchedule}
                renderItem={(course) => (
                  <List.Item className="schedule-item">
                    <div className="schedule-item-content">
                      <div className="time-and-class">
                        <Tag color="blue" className="time-tag">
                          <ClockCircleOutlined /> {course.time}
                        </Tag>
                        <Text strong>{course.class}</Text>
                      </div>
                      
                      <div className="course-details">
                        <div className="chapter-brief">
                          <Tag color="purple">Ch.{course.chapter.number}</Tag>
                          <Tooltip title={course.chapter.title}>
                            <Text ellipsis style={{ maxWidth: 180 }}>
                              {course.chapter.title}
                            </Text>
                          </Tooltip>
                        </div>
                        
                        <div className="course-meta">
                          <Tag color="default">
                            <EnvironmentOutlined /> {course.room}
                          </Tag>
                          <Tag color={
                            course.type === 'Cours' ? 'processing' :
                            course.type === 'TD' ? 'success' : 
                            'warning'
                          }>
                            {course.type}
                          </Tag>
                          <Tooltip title="Progression du chapitre">
                            <Progress 
                              percent={course.chapter.progress} 
                              size="small" 
                              style={{ width: '80px' }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              title={
                <div className="card-title">
                  <StarOutlined className="card-icon" />
                  <span>Appréciation des élèves</span>
                </div>
              }
              className="rating-card"
              bordered={false}
            >
              <div className="rating-content">
                <div className="rating-circle">
                  <Progress
                    type="circle"
                    percent={(teacherData.teacherRating.average / 5) * 100}
                    format={() => (
                      <div className="rating-value">
                        <span className="rating-number">{teacherData.teacherRating.average}</span>
                        <span className="rating-max">/5</span>
                        <StarFilled className="star-icon" />
                      </div>
                    )}
                    strokeColor="#ffd700"
                    width={120}
                  />
                  <div className="rating-total">
                    {teacherData.teacherRating.total} évaluations
                  </div>
                </div>

                <div className="recent-feedback">
                  {teacherData.teacherRating.recentFeedback.map((feedback, index) => (
                    <Tag key={index} color="blue" className="feedback-tag">
                      {feedback}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Grille principale */}
        <Row gutter={[16, 16]} className="main-grid">
          {/* Classes et leur suivi */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <TeamOutlined className="card-icon" />
                  <span>Suivi des classes</span>
                </div>
              }
              className="dashboard-card"
              bordered={false}
            >
              <List
                dataSource={teacherData.classes}
                renderItem={(item) => (
                  <List.Item className="class-item">
                    <div className="class-info">
                      <div className="class-header">
                        <Avatar size="large" className="class-avatar">
                          {item.name.charAt(0)}
                        </Avatar>
                        <div>
                          <Text strong>{item.name}</Text>
                          <div className="class-meta">
                            <Tag color="blue">{item.students} élèves</Tag>
                            <Tag color="green">Moy. {item.averageGrade}/20</Tag>
                          </div>
                        </div>
                      </div>
                      <div className="class-progress">
                        <Text type="secondary">Progression du programme</Text>
                        <Progress 
                          percent={item.progression} 
                          size="small"
                          status={item.progression < 70 ? 'exception' : 'active'}
                        />
                      </div>
                      <div className="class-actions">
                        <Button type="link" icon={<BookOutlined />}>
                          Notes ({item.pendingGrades})
                        </Button>
                        <Button type="link" icon={<BarChartOutlined />}>
                          Statistiques
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Échéances et tâches */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <ClockCircleOutlined className="card-icon" />
                  <span>Échéances à venir</span>
                </div>
              }
              className="dashboard-card deadlines-card"
              bordered={false}
            >
              <div className="deadlines-container">
                {teacherData.upcomingDeadlines.map((item, index) => (
                  <div key={index} className="deadline-item">
                    <div className="deadline-date">
                      <div className="date-box">
                        <div className="date-month">
                          {new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                        <div className="date-day">
                          {new Date(item.date).getDate()}
                        </div>
                      </div>
                      <div className="date-countdown">
                        {(() => {
                          const days = Math.ceil((new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24));
                          return days <= 0 ? "Aujourd'hui" : 
                                 days === 1 ? "Demain" :
                                 `Dans ${days} jours`;
                        })()}
                      </div>
                    </div>

                    <div className="deadline-content">
                      <div className="deadline-header">
                        <Tag color={
                          item.type === 'evaluation' ? 'blue' :
                          item.type === 'grades' ? 'green' : 
                          'orange'
                        }>
                          {item.type === 'evaluation' ? 'Évaluation' :
                           item.type === 'grades' ? 'Notes' : 
                           'Administratif'}
                        </Tag>
                        <Text className="deadline-class">{item.class}</Text>
                      </div>
                      <Text strong className="deadline-title">{item.title}</Text>
                      <div className="deadline-footer">
                        <Tag color={
                          item.status === 'À préparer' ? 'processing' :
                          item.status === 'À rendre' ? 'warning' :
                          'default'
                        }>
                          {item.status}
                        </Tag>
                        <Button type="link" size="small">
                          Gérer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Col span={24}>
          <Card 
            title={
              <div className="card-title">
                <BarChartOutlined className="card-icon" />
                <span>Analyse des performances</span>
              </div>
            }
            className="dashboard-card analytics-card"
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <div className="performance-chart">
                  <Text strong>Évolution des moyennes par classe</Text>
                  <Area
                    data={teacherData.classesAnalytics.monthlyProgress}
                    xField="month"
                    yField="value"
                    seriesField="class"
                    smooth
                    animation={{
                      appear: {
                        animation: 'path-in',
                        duration: 1000,
                      },
                    }}
                    yAxis={{
                      min: 10,
                      max: 15,
                      tickCount: 6,
                    }}
                    legend={{
                      position: 'top',
                    }}
                    areaStyle={{
                      fillOpacity: 0.2,
                    }}
                  />
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div className="rankings-container">
                  <div className="rankings-header">
                    <Text strong>Classement des classes</Text>
                    <Select defaultValue="average" style={{ width: 120 }} size="small">
                      <Option value="average">Moyenne</Option>
                      <Option value="attendance">Assiduité</Option>
                      <Option value="progression">Progression</Option>
                    </Select>
                  </div>

                  <div className="rankings-list">
                    {teacherData.classesAnalytics.rankings.map((item, index) => (
                      <div key={index} className="ranking-item">
                        <div className="ranking-position">
                          <div className={`position-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}>
                            {index + 1}
                          </div>
                        </div>

                        <div className="ranking-details">
                          <div className="ranking-main">
                            <Text strong>{item.class}</Text>
                            <div className="ranking-stats">
                              <Text className="grade">{item.averageGrade}/20</Text>
                              <Tag color={
                                item.trend === 'up' ? 'success' :
                                item.trend === 'down' ? 'error' : 
                                'default'
                              }>
                                {item.trend === 'up' ? <RiseOutlined /> :
                                 item.trend === 'down' ? <FallOutlined /> :
                                 '='} {Math.abs(item.averageGrade - item.lastMonth).toFixed(1)}
                              </Tag>
                            </div>
                          </div>

                          <div className="ranking-metrics">
                            <Tooltip title="Assiduité">
                              <Progress 
                                percent={item.attendance} 
                                size="small" 
                                strokeColor="#1890ff"
                                style={{ width: '80px' }}
                              />
                            </Tooltip>
                            <Tooltip title="Participation">
                              <Progress 
                                percent={item.participation} 
                                size="small" 
                                strokeColor="#52c41a"
                                style={{ width: '80px' }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .dashboard-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-card {
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          height: 100%;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
        }

        .card-icon {
          color: #1890ff;
          font-size: 18px;
        }

        .stat-card {
          border-radius: 12px;
          padding: 20px;
          height: 100%;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-title {
          color: #8c8c8c;
          font-size: 14px;
        }

        .stat-progress {
          margin-top: 8px;
        }

        .class-item, .assignment-item, .message-item {
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .class-item:hover, .assignment-item:hover, .message-item:hover {
          background: #fafafa;
        }

        .class-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .class-avatar {
          background: #1890ff;
        }

        .class-stats {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .assignment-info {
          width: 100%;
        }

        .assignment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .assignment-details {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .message-content {
          width: 100%;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .message-sender {
          display: block;
          font-size: 12px;
        }

        .message-date {
          font-size: 12px;
        }

        .calendar-card .ant-picker-calendar {
          background: white;
          padding: 16px;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }
        }

        .performance-item {
          padding: 16px;
          border-radius: 8px;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .performance-stats {
          display: flex;
          gap: 8px;
        }

        .task-item {
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .task-item:hover {
          background: #fafafa;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .task-deadline {
          display: flex;
          align-items: center;
          font-size: 12px;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 8px;
        }

        .today-schedule-card {
          margin-bottom: 24px;
        }

        .schedule-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .time-block {
          min-width: 120px;
          text-align: right;
        }

        .course-card {
          flex: 1;
          background: #fafafa;
        }

        .course-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-tag {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .class-progress {
          margin: 8px 0;
        }

        .class-actions {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .deadline-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }

        .course-content {
          padding: 8px;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .course-main-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .course-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chapter-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chapter-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chapter-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #fafafa;
          padding: 8px;
          border-radius: 4px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .course-card {
          flex: 1;
          background: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          transition: all 0.3s;
        }

        .course-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        }

        .today-schedule-card {
          margin-bottom: 24px;
        }

        .schedule-item {
          padding: 8px 0;
          transition: all 0.3s;
        }

        .schedule-item:hover {
          background: #fafafa;
        }

        .schedule-item-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-and-class {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-tag {
          min-width: 120px;
          text-align: center;
        }

        .course-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 132px;
        }

        .chapter-brief {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .course-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .course-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            margin-left: 0;
          }
        }

        .rating-card {
          height: 100%;
        }

        .rating-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .rating-circle {
          text-align: center;
        }

        .rating-value {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
        }

        .rating-number {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
        }

        .rating-max {
          font-size: 14px;
          color: #8c8c8c;
        }

        .star-icon {
          color: #ffd700;
          font-size: 20px;
          margin-top: 4px;
        }

        .rating-total {
          margin-top: 8px;
          color: #8c8c8c;
          font-size: 12px;
        }

        .recent-feedback {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .feedback-tag {
          border-radius: 12px;
          padding: 4px 12px;
        }

        .stats-row {
          margin-bottom: 24px;
        }

        .stat-card.highlight {
          position: relative;
          overflow: hidden;
          padding: 24px;
          background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
          transition: all 0.3s;
        }

        .stat-card.highlight:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .stat-icon-bg {
          position: absolute;
          right: -10px;
          top: -10px;
          font-size: 80px;
          opacity: 0.1;
          transform: rotate(15deg);
          transition: all 0.3s;
        }

        .stat-card.highlight:hover .stat-icon-bg {
          transform: rotate(0deg) scale(1.1);
          opacity: 0.15;
        }

        .stat-title {
          font-size: 16px;
          font-weight: 500;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }

        .stat-progress {
          margin-top: 16px;
          height: 6px !important;
        }

        .stat-progress .ant-progress-bg {
          height: 6px !important;
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .stat-card.highlight {
            margin-bottom: 16px;
          }
        }

        .deadlines-card {
          height: 100%;
        }

        .deadlines-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .deadline-item {
          display: flex;
          gap: 16px;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .deadline-item:hover {
          background: #f0f0f0;
          transform: translateX(4px);
        }

        .deadline-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 80px;
        }

        .date-box {
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          padding: 4px 8px;
          text-align: center;
          width: 70px;
        }

        .date-month {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }

        .date-day {
          font-size: 20px;
          font-weight: bold;
          color: #1890ff;
        }

        .date-countdown {
          font-size: 11px;
          color: #888;
        }

        .deadline-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .deadline-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .deadline-class {
          color: #666;
          font-size: 13px;
        }

        .deadline-title {
          font-size: 14px;
        }

        .deadline-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }

        .analytics-card {
          margin-top: 16px;
        }

        .performance-chart {
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          height: 100%;
        }

        .rankings-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rankings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rankings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ranking-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .ranking-item:hover {
          transform: translateX(4px);
          background: #f0f0f0;
        }

        .position-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .position-badge.gold {
          background: linear-gradient(135deg, #ffd700 0%, #ffb900 100%);
        }

        .position-badge.silver {
          background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
        }

        .position-badge.bronze {
          background: linear-gradient(135deg, #cd7f32 0%, #a05a20 100%);
        }

        .ranking-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ranking-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ranking-stats {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .grade {
          font-weight: bold;
          color: #1890ff;
        }

        .ranking-metrics {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </AppLayout>
  );
};

export default TeacherDashboard; 