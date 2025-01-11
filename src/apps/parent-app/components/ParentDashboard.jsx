import { Card, Row, Col, List, Progress, Typography, Avatar, Statistic, Timeline, Tag, Badge } from 'antd';
import { 
  DashboardOutlined, 
  LineChartOutlined, 
  ClockCircleOutlined, 
  MessageOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  UserOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';

const { Title, Text } = Typography;

export const menuItems = [
  {
    key: '/parent',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord'
  },
  {
    key: '/parent/performance',
    icon: <LineChartOutlined />,
    label: 'Performance'
  },
  {
    key: '/parent/attendance',
    icon: <ClockCircleOutlined />,
    label: 'Assiduité'
  },
  {
    key: '/parent/messages',
    icon: <MessageOutlined />,
    label: 'Messages'
  }
];

const ParentDashboard = () => {
  const studentInfo = {
    name: 'Thomas Dubois',
    class: '3ème A',
    photo: null, // URL de la photo si disponible
    recentGrades: [
      { 
        subject: 'Mathématiques',
        grade: '16/20',
        date: '2024-03-15',
        type: 'Contrôle',
        teacher: 'M. Martin',
        average: '14.5/20'
      },
      { 
        subject: 'Français',
        grade: '14/20',
        date: '2024-03-14',
        type: 'Dissertation',
        teacher: 'Mme Bernard',
        average: '13.8/20'
      },
      { 
        subject: 'Histoire',
        grade: '15/20',
        date: '2024-03-13',
        type: 'Exposé',
        teacher: 'M. Dubois',
        average: '14.2/20'
      }
    ],
    attendance: {
      present: 95,
      absences: [
        { 
          date: '2024-03-10',
          reason: 'Maladie',
          status: 'Justifiée',
          duration: '1 jour'
        },
        { 
          date: '2024-03-01',
          reason: 'Rendez-vous médical',
          status: 'Justifiée',
          duration: '1/2 journée'
        }
      ],
      lates: [
        { date: '2024-03-05', duration: '10 min' }
      ]
    },
    notifications: [
      {
        type: 'important',
        title: 'Réunion parents-professeurs',
        date: '25 mars 2024',
        details: 'De 17h à 20h au gymnase'
      },
      {
        type: 'success',
        title: 'Bulletin du 2ème trimestre disponible',
        date: '15 mars 2024',
        details: 'Consultable dans l\'espace documents'
      },
      {
        type: 'info',
        title: 'Sortie scolaire prévue',
        date: '30 mars 2024',
        details: 'Musée d\'Histoire - Autorisation requise'
      }
    ],
    performance: {
      generalAverage: 14.8,
      ranking: 5,
      totalStudents: 28,
      progression: +0.5
    },
    upcomingEvents: [
      {
        type: 'exam',
        subject: 'Mathématiques',
        title: 'Contrôle de géométrie',
        date: '2024-03-25',
        importance: 'high',
        details: 'Chapitres 5 et 6 - Coefficient 3'
      },
      {
        type: 'homework',
        subject: 'Français',
        title: 'Dissertation',
        date: '2024-03-28',
        importance: 'medium',
        details: 'À rendre sur la plateforme'
      },
      {
        type: 'event',
        subject: 'Orientation',
        title: 'Forum des métiers',
        date: '2024-04-02',
        importance: 'high',
        details: 'Présence obligatoire - 9h à 16h'
      }
    ],
    trimesterResults: [
      {
        trimester: 1,
        average: 14.2,
        ranking: 8,
        totalStudents: 28,
        mention: 'Assez bien',
        appreciation: 'Bon trimestre dans l\'ensemble. Élève sérieux et participatif. Poursuivez vos efforts.',
        classAverage: 13.5,
        bestAverage: 16.2,
        subjects: {
          strong: ['Mathématiques', 'Histoire'],
          weak: ['Anglais']
        }
      },
      {
        trimester: 2,
        average: 14.8,
        ranking: 5,
        totalStudents: 28,
        mention: 'Bien',
        appreciation: 'Excellent trimestre. Progression notable dans toutes les matières. Continuez ainsi !',
        classAverage: 13.8,
        bestAverage: 16.5,
        subjects: {
          strong: ['Mathématiques', 'Français'],
          weak: []
        }
      },
      {
        trimester: 3,
        average: null, // Trimestre en cours
        ranking: null,
        totalStudents: 28,
        mention: null,
        appreciation: null,
        classAverage: null,
        bestAverage: null,
        subjects: {
          strong: [],
          weak: []
        }
      }
    ]
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="dashboard-container">
        {/* En-tête avec informations de l'élève */}
        <Card className="welcome-card mb-6" bordered={false}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar 
                size={80} 
                src={studentInfo.photo}
                icon={!studentInfo.photo && <UserOutlined />}
                className="student-avatar"
              />
              <div>
                <Title level={2} className="!mb-0">{studentInfo.name}</Title>
                <div className="flex items-center space-x-2">
                  <Badge status="processing" />
                  <Text type="secondary">Classe : {studentInfo.class}</Text>
                </div>
              </div>
            </div>
            <div className="performance-summary text-right">
              <Statistic
                title="Moyenne générale"
                value={studentInfo.performance.generalAverage}
                suffix="/20"
                precision={1}
                valueStyle={{ color: '#3f8600' }}
                prefix={<TrophyOutlined />}
              />
              <Text type="secondary">
                Rang : {studentInfo.performance.ranking}/{studentInfo.performance.totalStudents}
              </Text>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Colonne de gauche */}
          <Col xs={24} lg={16}>
            {/* Notes récentes */}
            <Card 
              title={<div className="flex items-center"><BookOutlined className="mr-2" />Notes récentes</div>}
              className="mb-4"
              bordered={false}
            >
              <List
                dataSource={studentInfo.recentGrades}
                renderItem={(item) => (
                  <List.Item>
                    <div className="w-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Text strong>{item.subject}</Text>
                          <div className="text-sm text-gray-500">
                            {item.type} - {item.teacher}
                          </div>
                        </div>
                        <div className="text-right">
                          <Tag color="blue" className="mb-1">{item.grade}</Tag>
                          <div className="text-sm text-gray-500">
                            Moyenne classe : {item.average}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Assiduité détaillée */}
            <Card 
              title={<div className="flex items-center"><ClockCircleOutlined className="mr-2" />Assiduité</div>}
              bordered={false}
            >
              <Row gutter={[16, 16]} className="mb-4">
                <Col span={8}>
                  <Progress
                    type="circle"
                    percent={studentInfo.attendance.present}
                    format={(percent) => `${percent}%`}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <div className="text-center mt-2">
                    <Text strong>Taux de présence</Text>
                  </div>
                </Col>
                <Col span={16}>
                  <Timeline
                    items={[
                      ...studentInfo.attendance.absences.map(absence => ({
                        color: 'red',
                        children: (
                          <div>
                            <div className="font-medium">Absence {absence.status}</div>
                            <div className="text-sm text-gray-500">
                              {absence.reason} - {absence.duration}
                            </div>
                            <div className="text-xs text-gray-400">{absence.date}</div>
                          </div>
                        )
                      })),
                      ...studentInfo.attendance.lates.map(late => ({
                        color: 'orange',
                        children: (
                          <div>
                            <div className="font-medium">Retard</div>
                            <div className="text-sm text-gray-500">
                              Durée : {late.duration}
                            </div>
                            <div className="text-xs text-gray-400">{late.date}</div>
                          </div>
                        )
                      }))
                    ]}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Colonne de droite */}
          <Col xs={24} lg={8}>
            {/* Notifications */}
            <Card 
              title={<div className="flex items-center"><MessageOutlined className="mr-2" />Notifications</div>}
              bordered={false}
              className="mb-4"
            >
              <List
                itemLayout="vertical"
                dataSource={studentInfo.notifications}
                renderItem={(item) => (
                  <List.Item className="notification-item">
                    <div className="flex items-start space-x-3">
                      <div className={`notification-icon ${item.type}`}>
                        {item.type === 'important' ? <WarningOutlined /> : 
                         item.type === 'success' ? <CheckCircleOutlined /> : 
                         <CalendarOutlined />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.details}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.date}</div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card 
              title={
                <div className="flex items-center">
                  <TrophyOutlined className="mr-2" />
                  <span>Résultats trimestriels</span>
                </div>
              }
              bordered={false}
              className="trimester-results-card"
            >
              <div className="trimester-grid">
                {studentInfo.trimesterResults.map((trimester, index) => (
                  <div key={index} className="trimester-block">
                    <div className="trimester-header">
                      <Title level={4} className="!mb-0">
                        {trimester.trimester}er Trimestre
                      </Title>
                      {trimester.average ? (
                        <div className="text-center">
                          <Statistic 
                            value={trimester.average} 
                            suffix="/20"
                            precision={1}
                            valueStyle={{ 
                              color: trimester.average >= 14 ? '#3f8600' : 
                                     trimester.average >= 12 ? '#1890ff' : 
                                     '#cf1322'
                            }}
                          />
                          <Tag color={
                            trimester.mention === 'Très bien' ? 'success' :
                            trimester.mention === 'Bien' ? 'processing' :
                            trimester.mention === 'Assez bien' ? 'warning' :
                            'default'
                          }>
                            {trimester.mention || 'En cours'}
                          </Tag>
                        </div>
                      ) : (
                        <Tag color="processing" className="w-full text-center">En cours</Tag>
                      )}
                    </div>

                    {trimester.average && (
                      <div className="trimester-content">
                        <div className="ranking-info">
                          <div className="text-center">
                            <Text type="secondary">Rang</Text>
                            <div className="font-bold text-lg">{trimester.ranking}/{trimester.totalStudents}</div>
                          </div>
                          <div className="text-center">
                            <Text type="secondary">Moyenne classe</Text>
                            <div className="font-bold text-lg">{trimester.classAverage}/20</div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <Text type="secondary">Meilleure moyenne</Text>
                          <div className="font-bold text-lg">{trimester.bestAverage}/20</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .dashboard-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .welcome-card {
          background: linear-gradient(135deg, #1890ff0a 0%, #1890ff1a 100%);
          border-radius: 12px;
        }

        .student-avatar {
          border: 2px solid #1890ff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .notification-item {
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .notification-item:hover {
          background-color: #f5f5f5;
        }

        .notification-icon {
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon.important {
          background-color: #fff2f0;
          color: #ff4d4f;
        }

        .notification-icon.success {
          background-color: #f6ffed;
          color: #52c41a;
        }

        .notification-icon.info {
          background-color: #e6f7ff;
          color: #1890ff;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .student-avatar {
            width: 60px;
            height: 60px;
          }

          .ant-card-body {
            padding: 16px;
          }
        }

        .upcoming-events-card {
          margin-top: 16px;
        }

        .event-item {
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s;
          margin-bottom: 8px;
          background: #fafafa;
        }

        .event-item:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }

        .countdown-tag {
          min-width: 80px;
          text-align: right;
        }

        .event-item:last-child {
          margin-bottom: 0;
        }

        .trimester-results-card {
          height: 380px;
          margin-top: 16px;
        }

        .trimester-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          height: 100%;
        }

        .trimester-block {
          background: #fafafa;
          border-radius: 8px;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          height: 300px;
        }

        .trimester-header {
          padding: 12px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
        }

        .trimester-header .ant-typography {
          font-size: 16px !important;
        }

        .trimester-content {
          padding: 12px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .ranking-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .ant-statistic {
          display: inline-block;
          margin-bottom: 6px;
        }

        .ant-statistic-content {
          font-size: 24px !important;
          font-weight: bold;
        }

        .ant-tag {
          font-size: 12px;
        }

        .ant-typography.ant-typography-secondary {
          font-size: 12px;
        }

        @media (max-width: 1200px) {
          .trimester-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .trimester-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default ParentDashboard; 