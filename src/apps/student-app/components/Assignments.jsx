import { Table, Tag, Space, Button, Card, Typography, Row, Col, Progress, Statistic, Input, Select, Badge } from 'antd';
import { 
  DownloadOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SyncOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './StudentDashboard';

const { Title, Text } = Typography;
const { Option } = Select;

const Assignments = () => {
  const assignments = [
    {
      key: '1',
      subject: 'Mathématiques',
      title: 'Exercices Chapitre 3',
      description: 'Exercices sur les fonctions dérivées et leurs applications',
      deadline: '2024-03-20',
      status: 'À faire',
      attachment: true,
      progress: 0,
      teacher: 'Prof. Martin',
      type: 'Devoir maison',
      estimatedTime: '2h',
      attachmentDetails: {
        name: 'exercices_ch3.pdf',
        size: '2.4 MB'
      }
    },
    {
      key: '2',
      subject: 'Français',
      title: 'Dissertation',
      description: 'Dissertation sur le réalisme en littérature',
      deadline: '2024-03-22',
      status: 'En cours',
      attachment: true,
      progress: 35,
      teacher: 'Prof. Dubois',
      type: 'Dissertation',
      estimatedTime: '4h',
      attachmentDetails: {
        name: 'sujet_dissertation.pdf',
        size: '1.8 MB'
      }
    },
    {
      key: '3',
      subject: 'Histoire',
      title: 'Exposé',
      description: 'Présentation sur la Révolution Industrielle',
      deadline: '2024-03-25',
      status: 'À faire',
      attachment: false,
      progress: 0,
      teacher: 'Prof. Lambert',
      type: 'Exposé',
      estimatedTime: '3h'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'À faire': return 'error';
      case 'En cours': return 'processing';
      case 'Terminé': return 'success';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Devoir',
      key: 'assignment',
      fixed: 'left',
      width: 300,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge status={getStatusColor(record.status)} />
            <Text strong>{record.title}</Text>
          </div>
          <div>
            <Tag color="blue">{record.subject}</Tag>
            <Tag color="cyan">{record.type}</Tag>
          </div>
          <Text type="secondary" className="text-sm block">
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Progression',
      key: 'progress',
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <Progress percent={record.progress} size="small" />
          <div className="flex items-center text-gray-500 text-sm">
            <ClockCircleOutlined className="mr-1" />
            Temps estimé: {record.estimatedTime}
          </div>
        </div>
      ),
    },
    {
      title: 'Date limite',
      key: 'deadline',
      width: 200,
      render: (_, record) => {
        const deadline = new Date(record.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {deadline.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </div>
            <Tag color={daysLeft <= 2 ? 'error' : daysLeft <= 5 ? 'warning' : 'success'}>
              {daysLeft} jours restants
            </Tag>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" className="w-full">
          {record.attachment && (
            <Button 
              icon={<DownloadOutlined />}
              block
            >
              {record.attachmentDetails?.name}
            </Button>
          )}
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            block
          >
            Rendre le devoir
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BookOutlined className="text-2xl" />
          <Title level={2} className="!mb-0">Devoirs</Title>
        </div>

        {/* Statistiques */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full">
              <Statistic
                title="Devoirs à faire"
                value={assignments.filter(a => a.status === 'À faire').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full">
              <Statistic
                title="En cours"
                value={assignments.filter(a => a.status === 'En cours').length}
                prefix={<SyncOutlined spin />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full">
              <Statistic
                title="Terminés"
                value={assignments.filter(a => a.status === 'Terminé').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtres */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Rechercher un devoir..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select defaultValue="all" style={{ width: 200 }}>
              <Option value="all">Toutes les matières</Option>
              <Option value="maths">Mathématiques</Option>
              <Option value="francais">Français</Option>
              <Option value="histoire">Histoire</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 200 }}>
              <Option value="all">Tous les statuts</Option>
              <Option value="todo">À faire</Option>
              <Option value="inProgress">En cours</Option>
              <Option value="done">Terminé</Option>
            </Select>
            <Select defaultValue="deadline" style={{ width: 200 }}>
              <Option value="deadline">Trier par date limite</Option>
              <Option value="subject">Trier par matière</Option>
              <Option value="status">Trier par statut</Option>
            </Select>
          </div>
        </Card>

        {/* Table des devoirs */}
        <Card bordered={false} className="assignments-table">
          <Table 
            columns={columns} 
            dataSource={assignments}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>

      <style jsx global>{`
        .assignments-table .ant-table-cell {
          vertical-align: top;
          padding: 16px;
        }

        .assignments-table .ant-table-row:hover {
          cursor: pointer;
        }

        .assignments-table .ant-progress-text {
          font-size: 12px;
        }
      `}</style>
    </AppLayout>
  );
};

export default Assignments; 