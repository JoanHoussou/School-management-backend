import { useState } from 'react';
import { Card, Row, Col, List, Tag, Statistic, Progress, Timeline, Typography, Avatar, Calendar, Modal, Input, Button, Popover, Select } from 'antd';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  BookOutlined, 
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BellOutlined,
  BookFilled,
  ReadOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Export des menuItems pour les autres composants
export const menuItems = [
  {
    key: '/student',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord'
  },
  {
    key: '/student/schedule',
    icon: <CalendarOutlined />,
    label: 'Emploi du temps'
  },
  {
    key: '/student/assignments',
    icon: <BookOutlined />,
    label: 'Devoirs'
  },
  {
    key: '/student/messages',
    icon: <MessageOutlined />,
    label: 'Messages'
  },
  {
    key: '/student/grades',
    icon: <BookFilled />,
    label: 'Notes'
  },
  {
    key: '/student/courses',
    icon: <ReadOutlined />,
    label: 'Cours'
  },
];

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [personalNotes, setPersonalNotes] = useState({
    // Format: 'YYYY-MM-DD': { content: string, type: 'personal' | 'task' | 'idea' }
    '2024-03-20': {
      content: 'Réviser les mathématiques pour le contrôle de la semaine prochaine',
      type: 'task'
    },
    '2024-03-22': {
      content: "Idée de sujet pour l'exposé d'histoire : La révolution industrielle",
      type: 'idea'
    }
  });

  const recentAssignments = [
    { 
      title: 'Mathématiques - Exercices Chapitre 3',
      deadline: '2024-03-20',
      progress: 0,
      priority: 'high',
      subject: 'Mathématiques'
    },
    { 
      title: 'Français - Dissertation',
      deadline: '2024-03-22',
      progress: 35,
      priority: 'medium',
      subject: 'Français'
    },
    { 
      title: 'Histoire - Exposé',
      deadline: '2024-03-25',
      progress: 75,
      priority: 'low',
      subject: 'Histoire'
    }
  ];

  const todayClasses = [
    { 
      time: '08:00 - 10:00',
      subject: 'Mathématiques',
      room: 'Salle 201',
      status: 'En cours',
      teacher: 'Prof. Martin',
      type: 'Cours'
    },
    { 
      time: '10:15 - 12:15',
      subject: 'Français',
      room: 'Salle 105',
      status: 'À venir',
      teacher: 'Prof. Dubois',
      type: 'TD'
    },
    { 
      time: '14:00 - 16:00',
      subject: 'Histoire',
      room: 'Salle 304',
      status: 'À venir',
      teacher: 'Prof. Lambert',
      type: 'Cours'
    }
  ];

  const notifications = [
    { 
      type: 'success',
      content: 'Note publiée en Mathématiques',
      time: 'Il y a 1h',
      details: '17/20 - Contrôle de fonctions'
    },
    { 
      type: 'warning',
      content: 'Rappel : Devoir à rendre demain',
      time: 'Il y a 2h',
      details: 'Exercices de Mathématiques - Chapitre 3'
    },
    { 
      type: 'info',
      content: 'Nouveau message du Prof. Martin',
      time: 'Il y a 3h',
      details: 'Concernant le prochain TP'
    }
  ];

  const performanceStats = {
    averageProgress: 85,
    ranking: 5,
    totalStudents: 28,
    attendance: 95
  };

  // Au début du composant, initialisez dayjs
  dayjs.extend(LocalizedFormat);
  dayjs.locale('fr');

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setNoteContent(personalNotes[date.format('YYYY-MM-DD')]?.content || '');
    setNoteModalVisible(true);
  };

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      setPersonalNotes(prev => ({
        ...prev,
        [selectedDate]: {
          content: noteContent,
          type: 'personal'
        }
      }));
    } else {
      // Si la note est vide, on la supprime
      const newNotes = { ...personalNotes };
      delete newNotes[selectedDate];
      setPersonalNotes(newNotes);
    }
    setNoteModalVisible(false);
    setNoteContent('');
  };

  const dateCellRender = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const note = personalNotes[dateStr];

    if (note) {
      return (
        <Popover
          content={
            <div className="max-w-xs">
              <p className="text-sm">{note.content}</p>
              <div className="flex justify-end mt-2">
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateSelect(date);
                  }}
                />
                <Button 
                  type="text" 
                  size="small" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newNotes = { ...personalNotes };
                    delete newNotes[dateStr];
                    setPersonalNotes(newNotes);
                  }}
                />
              </div>
            </div>
          }
          trigger="hover"
        >
          <div className="personal-note-indicator">
            <div className={`note-dot ${note.type}`} />
          </div>
        </Popover>
      );
    }
    return null;
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar size={64} style={{ backgroundColor: '#1890ff' }}>JD</Avatar>
            <div>
              <Title level={2} className="!mb-0">Bonjour, Jean Dupont</Title>
              <Text type="secondary">Classe de Terminale S2</Text>
            </div>
          </div>
          <div className="text-right">
            <Text className="text-lg">{new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</Text>
            <div className="text-gray-400">Semaine 12 - Trimestre 2</div>
          </div>
        </div>
        
        {/* Première rangée - Statistiques */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="dashboard-stat-card">
              <Statistic 
                title={<div className="flex items-center"><TrophyOutlined className="mr-2" />Moyenne Générale</div>}
                value={15.5}
                suffix="/20"
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress percent={77.5} strokeColor="#3f8600" size="small" className="mt-2" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="dashboard-stat-card">
              <Statistic 
                title={<div className="flex items-center"><FileTextOutlined className="mr-2" />Devoirs à rendre</div>}
                value={3}
                valueStyle={{ color: '#cf1322' }}
              />
              <div className="mt-2 text-sm text-gray-500">
                Prochain devoir dans 2 jours
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="dashboard-stat-card">
              <Statistic 
                title={<div className="flex items-center"><TeamOutlined className="mr-2" />Classement</div>}
                value={performanceStats.ranking}
                suffix={`/ ${performanceStats.totalStudents}`}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="mt-2 text-sm text-gray-500">
                <RiseOutlined /> +2 places ce mois
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="dashboard-stat-card">
              <Statistic 
                title={<div className="flex items-center"><CheckCircleOutlined className="mr-2" />Présence</div>}
                value={performanceStats.attendance}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress percent={performanceStats.attendance} strokeColor="#52c41a" size="small" className="mt-2" />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Emploi du temps du jour */}
          <Col xs={24} lg={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  title={<div className="flex items-center"><CalendarOutlined className="mr-2" />Cours d'aujourd'hui</div>}
                  className="dashboard-card"
                  bordered={false}
                >
                  <Timeline
                    items={todayClasses.map(classe => ({
                      color: classe.status === 'En cours' ? 'green' : 'blue',
                      dot: classe.status === 'En cours' ? <ClockCircleOutlined className="timeline-clock" /> : undefined,
                      children: (
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Text strong>{classe.subject}</Text>
                              <Tag color="blue">{classe.type}</Tag>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <div>{classe.teacher}</div>
                              <div>{classe.room}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{classe.time}</div>
                            <Tag color={classe.status === 'En cours' ? 'success' : 'default'}>
                              {classe.status}
                            </Tag>
                          </div>
                        </div>
                      )
                    }))}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card 
                  title={<div className="flex items-center"><BookOutlined className="mr-2" />Devoirs en cours</div>}
                  className="dashboard-card"
                  bordered={false}
                >
                  <List
                    dataSource={recentAssignments}
                    renderItem={(item) => (
                      <List.Item>
                        <div className="w-full">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Text strong>{item.title}</Text>
                                <Tag color={
                                  item.priority === 'high' ? 'error' :
                                  item.priority === 'medium' ? 'warning' : 'success'
                                }>
                                  {item.priority === 'high' ? 'Urgent' :
                                   item.priority === 'medium' ? 'Important' : 'Normal'}
                                </Tag>
                              </div>
                              <Text type="secondary" className="text-sm">
                                Échéance : {item.deadline}
                              </Text>
                            </div>
                            <Tag color="blue">{item.subject}</Tag>
                          </div>
                          <Progress 
                            percent={item.progress}
                            size="small"
                            status={item.progress === 0 ? 'exception' : 'active'}
                          />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Panneau latéral droit */}
          <Col xs={24} lg={8}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  title={<div className="flex items-center"><BellOutlined className="mr-2" />Notifications</div>}
                  className="dashboard-card"
                  bordered={false}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={notifications}
                    renderItem={(item) => (
                      <List.Item className="notification-item">
                        <div className="w-full">
                          <div className="flex items-start">
                            <Tag color={
                              item.type === 'success' ? 'success' : 
                              item.type === 'warning' ? 'warning' : 'processing'
                            } className="mt-1" />
                            <div className="ml-2 flex-1">
                              <div className="font-medium">{item.content}</div>
                              <div className="text-sm text-gray-500">{item.details}</div>
                              <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card 
                  className="dashboard-card"
                  bordered={false}
                  title="Mon calendrier personnel"
                  extra={
                    <Button 
                      type="text" 
                      icon={<PlusOutlined />}
                      onClick={() => handleDateSelect(dayjs())}
                    >
                      Ajouter une note
                    </Button>
                  }
                >
                  <Calendar 
                    fullscreen={false} 
                    dateCellRender={dateCellRender}
                    onSelect={handleDateSelect}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Modal
        title={`Note du ${selectedDate ? new Date(selectedDate).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : ''}`}
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          setNoteContent('');
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setNoteModalVisible(false);
              setNoteContent('');
            }}
          >
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary"
            onClick={handleSaveNote}
          >
            Enregistrer
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div className="mb-4">
            <Select
              style={{ width: '100%' }}
              placeholder="Type de note"
              defaultValue="personal"
              onChange={(value) => {
                setPersonalNotes(prev => ({
                  ...prev,
                  [selectedDate]: {
                    ...prev[selectedDate],
                    type: value
                  }
                }));
              }}
            >
              <Option value="personal">Note personnelle</Option>
              <Option value="task">Tâche à faire</Option>
              <Option value="idea">Idée</Option>
            </Select>
          </div>
          <TextArea
            rows={4}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Écrivez votre note ici..."
          />
        </div>
      </Modal>

      <style jsx global>{`
        .dashboard-stat-card {
          height: 100%;
          transition: all 0.3s;
          border-radius: 8px;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .dashboard-card {
          border-radius: 8px;
          height: 100%;
        }

        .timeline-clock {
          font-size: 16px;
        }

        .notification-item {
          padding: 12px 0;
          transition: all 0.3s;
          border-radius: 6px;
        }

        .notification-item:hover {
          background-color: #fafafa;
        }

        .ant-timeline-item-content {
          margin-left: 28px !important;
        }

        .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
          min-height: 48px;
        }

        .ant-card-head-title {
          padding: 12px 0;
        }

        .ant-progress-text {
          font-size: 12px;
        }

        .personal-note-indicator {
          display: flex;
          justify-content: center;
          padding: 2px;
        }

        .note-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #1890ff;
        }

        .note-dot.task {
          background-color: #ff4d4f;
        }

        .note-dot.idea {
          background-color: #52c41a;
        }

        .ant-picker-calendar-date-content {
          height: 20px !important;
        }
      `}</style>
    </AppLayout>
  );
};

export default StudentDashboard; 