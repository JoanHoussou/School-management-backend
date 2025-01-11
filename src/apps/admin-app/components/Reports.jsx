import { Card, Row, Col, Select, DatePicker, Button, Table, Space } from 'antd';
import { DownloadOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { Line, Bar } from '@ant-design/charts';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
  // Données simulées pour les graphiques
  const performanceData = [
    { class: '6ème', period: 'T1', average: 13.5 },
    { class: '6ème', period: 'T2', average: 14.2 },
    { class: '6ème', period: 'T3', average: 14.8 },
    { class: '5ème', period: 'T1', average: 12.8 },
    { class: '5ème', period: 'T2', average: 13.5 },
    { class: '5ème', period: 'T3', average: 14.0 },
    { class: '4ème', period: 'T1', average: 12.5 },
    { class: '4ème', period: 'T2', average: 13.2 },
    { class: '4ème', period: 'T3', average: 13.8 },
    { class: '3ème', period: 'T1', average: 13.0 },
    { class: '3ème', period: 'T2', average: 13.7 },
    { class: '3ème', period: 'T3', average: 14.5 }
  ];

  const attendanceData = [
    { month: 'Sept', attendance: 97 },
    { month: 'Oct', attendance: 96 },
    { month: 'Nov', attendance: 95 },
    { month: 'Déc', attendance: 94 },
    { month: 'Jan', attendance: 93 },
    { month: 'Fév', attendance: 95 }
  ];

  const subjectPerformance = [
    {
      key: '1',
      subject: 'Mathématiques',
      average: 13.5,
      highest: 18,
      lowest: 8,
      passRate: 85
    },
    {
      key: '2',
      subject: 'Français',
      average: 14.2,
      highest: 19,
      lowest: 9,
      passRate: 88
    },
    {
      key: '3',
      subject: 'Histoire',
      average: 13.8,
      highest: 17,
      lowest: 7,
      passRate: 82
    }
  ];

  const columns = [
    {
      title: 'Matière',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Moyenne',
      dataIndex: 'average',
      key: 'average',
      render: (value) => `${value.toFixed(1)}/20`,
    },
    {
      title: 'Note max',
      dataIndex: 'highest',
      key: 'highest',
      render: (value) => `${value}/20`,
    },
    {
      title: 'Note min',
      dataIndex: 'lowest',
      key: 'lowest',
      render: (value) => `${value}/20`,
    },
    {
      title: 'Taux de réussite',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (value) => `${value}%`,
    }
  ];

  const performanceConfig = {
    data: performanceData,
    xField: 'period',
    yField: 'average',
    seriesField: 'class',
    yAxis: {
      title: {
        text: 'Moyenne générale /20'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const attendanceConfig = {
    data: attendanceData,
    xField: 'month',
    yField: 'attendance',
    columnStyle: {
      radius: [20, 20, 0, 0]
    },
    label: {
      position: 'top',
      style: {
        fill: '#aaa'
      }
    },
    yAxis: {
      title: {
        text: 'Taux de présence (%)'
      }
    }
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Rapports et Analyses</h2>
          <Space>
            <Select defaultValue="2023-2024" style={{ width: 120 }}>
              <Option value="2023-2024">2023-2024</Option>
              <Option value="2022-2023">2022-2023</Option>
            </Select>
            <RangePicker />
            <Button icon={<DownloadOutlined />}>
              Exporter
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <LineChartOutlined />
                  Performance par niveau
                </Space>
              }
            >
              <Line {...performanceConfig} />
            </Card>
          </Col>

          <Col span={12}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined />
                  Assiduité mensuelle
                </Space>
              }
            >
              <Bar {...attendanceConfig} />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Performance par matière">
              <Table 
                columns={columns} 
                dataSource={subjectPerformance}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Analyses détaillées">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="Taux de réussite global" bordered={false}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">85%</div>
                  <div className="text-gray-500">des élèves au-dessus de la moyenne</div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Progression moyenne" bordered={false}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">+1.2</div>
                  <div className="text-gray-500">points depuis le début de l'année</div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Assiduité moyenne" bordered={false}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">95%</div>
                  <div className="text-gray-500">de présence sur l'année</div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports; 