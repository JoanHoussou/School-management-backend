import { Card, Row, Col, Typography, Statistic, Tag, Progress, Tooltip } from 'antd';
import { Line } from '@ant-design/charts';
import { 
  TrophyOutlined, 
  RiseOutlined,
  StarOutlined,
  BookOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './ParentDashboard';

const { Title, Text } = Typography;

const PerformanceOverview = () => {
  const studentPerformance = {
    currentTrimester: 2,
    generalStats: {
      average: 15.2,
      rank: 5,
      totalStudents: 28,
      progression: +1.2,
      bestSubject: 'Mathématiques',
      toImprove: 'Anglais'
    },
    subjects: [
      {
        name: 'Mathématiques',
        average: 16.5,
        lastGrade: 17,
        trend: 'up',
        coefficient: 3,
        teacher: 'M. Martin',
        data: [14, 16, 15, 17, 16]
      },
      {
        name: 'Français',
        average: 14.8,
        lastGrade: 15,
        trend: 'stable',
        coefficient: 3,
        teacher: 'Mme Bernard',
        data: [13, 14, 14, 15, 14]
      },
      {
        name: 'Histoire',
        average: 15.5,
        lastGrade: 16,
        trend: 'up',
        coefficient: 2,
        teacher: 'M. Dubois',
        data: [13, 14, 15, 15, 16]
      }
    ]
  };

  const chartConfig = {
    data: studentPerformance.subjects.flatMap(subject => 
      subject.data.map((value, index) => ({
        subject: subject.name,
        evaluation: `Eval ${index + 1}`,
        note: value
      }))
    ),
    xField: 'evaluation',
    yField: 'note',
    seriesField: 'subject',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    },
    point: {
      size: 5,
      shape: 'circle'
    },
    yAxis: {
      min: 0,
      max: 20
    }
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="performance-container">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-0">Performance Scolaire</Title>
            <Text type="secondary">2ème Trimestre 2023-2024</Text>
          </div>
          <Tag color="blue" className="text-lg px-4 py-1">
            {studentPerformance.generalStats.rank}e / {studentPerformance.generalStats.totalStudents}
          </Tag>
        </div>

        {/* Widgets de statistiques */}
        <Row gutter={[16, 16]} className="mb-6">
          {/* Moyenne générale */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="stat-widget primary-stat">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="widget-label">Moyenne générale</Text>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">
                      {studentPerformance.generalStats.average}
                    </span>
                    <span className="text-lg">/20</span>
                  </div>
                  <Progress 
                    percent={studentPerformance.generalStats.average * 5}
                    showInfo={false}
                    strokeColor="#1890ff"
                    trailColor="#e6f4ff"
                    strokeWidth={4}
                  />
                </div>
                <TrophyOutlined className="widget-icon" />
              </div>
            </Card>
          </Col>

          {/* Meilleure matière */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="stat-widget success-stat">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="widget-label">Point fort</Text>
                  <div className="text-lg font-medium">
                    {studentPerformance.generalStats.bestSubject}
                  </div>
                  <div className="text-success text-sm">
                    <RiseOutlined /> Progression constante
                  </div>
                </div>
                <StarOutlined className="widget-icon" />
              </div>
            </Card>
          </Col>

          {/* Progression */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="stat-widget warning-stat">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="widget-label">À améliorer</Text>
                  <div className="text-lg font-medium">
                    {studentPerformance.generalStats.toImprove}
                  </div>
                  <div className="text-warning text-sm">
                    <LineChartOutlined /> Besoin d'attention
                  </div>
                </div>
                <BookOutlined className="widget-icon" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Graphique d'évolution */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={24}>
            <Card bordered={false} className="chart-widget">
              <Line {...chartConfig} height={300} />
            </Card>
          </Col>
        </Row>

        {/* Widgets des matières */}
        <Row gutter={[16, 16]}>
          {studentPerformance.subjects.map((subject, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card bordered={false} className="subject-widget">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Text className="widget-label">{subject.name}</Text>
                    <div className="text-sm text-gray-500">{subject.teacher}</div>
                  </div>
                  <Tag color="blue">Coef. {subject.coefficient}</Tag>
                </div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-2xl font-bold">{subject.average}</span>
                  <span className="text-gray-500">/20</span>
                  <Tag 
                    color={subject.trend === 'up' ? 'success' : 'processing'}
                    className="ml-2"
                  >
                    Dernière note : {subject.lastGrade}/20
                  </Tag>
                </div>
                <Progress 
                  percent={subject.average * 5}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  showInfo={false}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <style jsx global>{`
        .performance-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .stat-widget {
          border-radius: 12px;
          height: 100%;
          transition: all 0.3s;
        }

        .stat-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .widget-label {
          color: #8c8c8c;
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .widget-icon {
          font-size: 32px;
          opacity: 0.8;
        }

        .primary-stat .widget-icon {
          color: #1890ff;
        }

        .success-stat .widget-icon {
          color: #52c41a;
        }

        .warning-stat .widget-icon {
          color: #faad14;
        }

        .chart-widget {
          border-radius: 12px;
          background: linear-gradient(to right, #fafafa, #f0f2f5);
        }

        .subject-widget {
          border-radius: 12px;
          background: #fff;
          transition: all 0.3s;
        }

        .subject-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .text-success {
          color: #52c41a;
        }

        .text-warning {
          color: #faad14;
        }

        @media (max-width: 768px) {
          .performance-container {
            padding: 16px;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default PerformanceOverview; 