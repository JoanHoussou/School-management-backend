import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  InputNumber, 
  Select, 
  Tabs, 
  Row, 
  Col, 
  Statistic, 
  Typography,
  Progress,
  Tag,
  Tooltip,
  Space,
  Input,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LineChartOutlined,
  BookOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const GradesManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState('3ème A');

  const classData = {
    '3ème A': {
      students: [
        {
          key: '1',
          name: 'Thomas Dubois',
          grades: [
            { id: 1, value: 16, type: 'Contrôle', date: '2024-03-15', coefficient: 2 },
            { id: 2, value: 14, type: 'DM', date: '2024-03-10', coefficient: 1 }
          ],
          trend: 'up',
          lastGrade: 16,
          attendance: 95
        },
        {
          key: '2',
          name: 'Marie Martin',
          grades: [
            { id: 1, value: 15, type: 'Contrôle', date: '2024-03-15', coefficient: 2 },
            { id: 2, value: 17, type: 'DM', date: '2024-03-10', coefficient: 1 }
          ],
          trend: 'up',
          lastGrade: 17,
          attendance: 90
        }
      ],
      stats: {
        average: 15.5,
        highest: 18,
        lowest: 12,
        aboveAverage: 15,
        belowAverage: 10,
        lastEvaluation: {
          date: '2024-03-15',
          average: 14.8,
          type: 'Contrôle'
        }
      }
    },
    '4ème B': {
      students: [
        {
          key: '3',
          name: 'Lucas Bernard',
          grades: [
            { id: 1, value: 13, type: 'Contrôle', date: '2024-03-14', coefficient: 2 },
            { id: 2, value: 15, type: 'DM', date: '2024-03-09', coefficient: 1 }
          ],
          trend: 'up',
          lastGrade: 15,
          attendance: 85
        }
      ],
      stats: {
        average: 14,
        highest: 15,
        lowest: 13,
        aboveAverage: 14,
        belowAverage: 10,
        lastEvaluation: {
          date: '2024-03-14',
          average: 14,
          type: 'Contrôle'
        }
      }
    }
  };

  const renderClassHeader = (classInfo) => (
    <Row gutter={[16, 16]} className="class-stats-container">
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} className="stat-card primary">
          <Statistic
            title="Moyenne de classe"
            value={classInfo.stats.average}
            precision={1}
            suffix="/20"
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Progress 
            percent={classInfo.stats.average * 5} 
            showInfo={false}
            strokeColor="#1890ff"
            className="stat-progress"
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} className="stat-card success">
          <Statistic
            title="Au-dessus de la moyenne"
            value={classInfo.stats.aboveAverage}
            suffix={`/${classInfo.students.length}`}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress 
            percent={(classInfo.stats.aboveAverage / classInfo.students.length) * 100}
            showInfo={false}
            strokeColor="#52c41a"
            className="stat-progress"
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} className="stat-card warning">
          <Statistic
            title="Note la plus haute"
            value={classInfo.stats.highest}
            suffix="/20"
            prefix={<LineChartOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <div className="text-sm text-gray-500 mt-2">
            Note la plus basse: {classInfo.stats.lowest}/20
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} className="stat-card info">
          <div className="last-evaluation">
            <Text type="secondary">Dernière évaluation</Text>
            <div className="font-medium">{classInfo.stats.lastEvaluation.type}</div>
            <div className="text-sm">
              Moyenne: {classInfo.stats.lastEvaluation.average}/20
            </div>
            <div className="text-xs text-gray-500">
              {new Date(classInfo.stats.lastEvaluation.date).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const columns = [
    {
      title: 'Élève',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <div className="student-info">
          <div className="flex items-center gap-2">
            <Badge 
              status={record.attendance >= 90 ? 'success' : 'warning'} 
              text={text} 
            />
            {record.trend === 'up' ? (
              <Tag color="success" className="trend-tag">
                <RiseOutlined /> Progression
              </Tag>
            ) : record.trend === 'down' ? (
              <Tag color="error" className="trend-tag">
                <FallOutlined /> Baisse
              </Tag>
            ) : null}
          </div>
          <div className="text-xs text-gray-500">
            Assiduité: {record.attendance}%
          </div>
        </div>
      )
    },
    {
      title: 'Notes',
      children: classData[selectedClass].students[0]?.grades.map((_, index) => ({
        title: () => (
          <div className="grade-header">
            <div className="font-medium">Note {index + 1}</div>
            <div className="text-xs text-gray-500">
              Coef. {classData[selectedClass].students[0].grades[index].coefficient}
            </div>
          </div>
        ),
        dataIndex: ['grades', index, 'value'],
        key: `grade${index}`,
        width: 100,
        render: (value, record) => (
          <div className="grade-cell">
            <Tag 
              color={value >= 10 ? (value >= 15 ? 'success' : 'processing') : 'error'}
              className="grade-tag"
            >
              {value}/20
            </Tag>
            <div className="text-xs text-gray-500">
              {record.grades[index].type}
            </div>
          </div>
        )
      }))
    },
    {
      title: 'Moyenne',
      key: 'average',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        const avg = record.grades.reduce((sum, grade) => 
          sum + (grade.value * grade.coefficient), 0
        ) / record.grades.reduce((sum, grade) => sum + grade.coefficient, 0);
        
        return (
          <div className="average-cell">
            <Tag color={
              avg >= 15 ? 'success' :
              avg >= 10 ? 'processing' :
              'error'
            } className="average-tag">
              {avg.toFixed(1)}/20
            </Tag>
            <Progress 
              percent={avg * 5} 
              size="small" 
              showInfo={false}
              strokeColor={
                avg >= 15 ? '#52c41a' :
                avg >= 10 ? '#1890ff' :
                '#ff4d4f'
              }
            />
          </div>
        );
      }
    }
  ];

  return (
    <AppLayout menuItems={menuItems}>
      <div className="grades-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-0">Gestion des notes</Title>
            <Text type="secondary">Année scolaire 2023-2024</Text>
          </div>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size="large"
          >
            Nouvelle évaluation
          </Button>
        </div>

        <Card bordered={false} className="grades-card">
          <Tabs
            activeKey={selectedClass}
            onChange={setSelectedClass}
            type="card"
            className="class-tabs"
            items={Object.entries(classData).map(([className, data]) => ({
              key: className,
              label: (
                <span>
                  <TeamOutlined className="mr-2" />
                  {className}
                </span>
              ),
              children: (
                <div className="space-y-6">
                  {renderClassHeader(data)}
                  <Table 
                    columns={columns} 
                    dataSource={data.students}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    className="grades-table"
                  />
                </div>
              )
            }))}
          />
        </Card>
      </div>

      <style jsx global>{`
        .grades-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .grades-card {
          border-radius: 12px;
          overflow: hidden;
        }

        .class-stats-container {
          margin-bottom: 24px;
        }

        .stat-card {
          border-radius: 8px;
          transition: all 0.3s;
          height: 100%;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-progress {
          margin-top: 8px;
        }

        .grade-header {
          text-align: center;
        }

        .grade-cell {
          text-align: center;
        }

        .grade-tag {
          min-width: 60px;
          text-align: center;
        }

        .average-cell {
          text-align: center;
        }

        .average-tag {
          min-width: 70px;
          margin-bottom: 4px;
        }

        .trend-tag {
          font-size: 11px;
          padding: 0 6px;
        }

        .student-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .class-tabs .ant-tabs-nav {
          margin-bottom: 24px;
        }

        .class-tabs .ant-tabs-tab {
          padding: 8px 16px;
          transition: all 0.3s;
        }

        .class-tabs .ant-tabs-tab-active {
          background: #1890ff;
          border-color: #1890ff;
        }

        .class-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white;
        }

        .grades-table .ant-table-cell {
          padding: 12px 16px !important;
        }

        @media (max-width: 768px) {
          .grades-container {
            padding: 16px;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default GradesManager; 