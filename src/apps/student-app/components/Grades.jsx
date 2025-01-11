import { Tabs, Table, Card, Tag, Typography, Row, Col, Statistic, Divider } from 'antd';
import { TrophyOutlined, BookFilled, LineChartOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './StudentDashboard';

const { Title } = Typography;

const Grades = () => {
  // Données simulées des notes par trimestre
  const gradesData = {
    trimester1: {
      grades: [
        {
          key: '1',
          subject: 'Mathématiques',
          teacher: 'Prof. Martin',
          coefficient: 5,
          assignments: [
            { type: 'Devoir', grade: 15, coefficient: 1, date: '2024-01-15' },
            { type: 'Contrôle', grade: 17, coefficient: 2, date: '2024-02-01' },
            { type: 'Projet', grade: 16, coefficient: 1, date: '2024-02-15' }
          ],
          average: 16.25,
          rank: 3,
          classAverage: 14.5,
          totalStudents: 28,
          appreciation: "Excellent travail, continuez ainsi"
        },
        {
          key: '2',
          subject: 'Français',
          teacher: 'Prof. Dubois',
          coefficient: 5,
          assignments: [
            { type: 'Dissertation', grade: 14, coefficient: 2, date: '2024-01-20' },
            { type: 'Oral', grade: 16, coefficient: 1, date: '2024-02-05' },
            { type: 'Contrôle', grade: 15, coefficient: 2, date: '2024-02-20' }
          ],
          average: 15,
          rank: 5,
          classAverage: 13.8,
          totalStudents: 28,
          appreciation: "Bon trimestre, participation active en classe"
        },
        // Ajoutez d'autres matières...
      ],
      generalAverage: 15.63,
      generalRank: 4,
      totalStudents: 28,
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    }
  };

  const StatCard = ({ title, value, suffix, prefix, color }) => (
    <Card 
      bordered={false} 
      className="h-full shadow-sm hover:shadow-md transition-all duration-300"
      style={{ minHeight: '140px' }}
    >
      <Statistic
        title={<span className="text-base font-medium">{title}</span>}
        value={value}
        suffix={suffix}
        prefix={prefix}
        valueStyle={{ color, fontSize: '24px' }}
      />
    </Card>
  );

  const columns = [
    {
      title: 'Matière',
      dataIndex: 'subject',
      key: 'subject',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <div className="space-y-1">
          <div className="font-medium text-lg">{text}</div>
          <div className="text-sm text-gray-500">{record.teacher}</div>
          <Tag color="blue">Coefficient {record.coefficient}</Tag>
        </div>
      ),
    },
    {
      title: 'Évaluations',
      dataIndex: 'assignments',
      key: 'assignments',
      width: 300,
      render: (assignments) => (
        <div className="space-y-2">
          {assignments.map((assignment, index) => (
            <Card key={index} size="small" className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <Tag color="blue">{assignment.type}</Tag>
                  <span className="text-xs text-gray-500 ml-2">{assignment.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-lg mr-2">{assignment.grade}/20</span>
                  <Tag color="gray">Coef. {assignment.coefficient}</Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: 'Moyennes & Rang',
      key: 'averages',
      width: 250,
      render: (_, record) => (
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">Votre moyenne :</div>
            <Tag color={record.average >= 15 ? 'success' : record.average >= 10 ? 'warning' : 'error'} 
                className="text-lg px-4 py-1">
              {record.average}/20
            </Tag>
          </div>
          <Divider className="my-2" />
          <div>
            <div className="text-sm text-gray-500 mb-1">Rang :</div>
            <div className="flex items-center space-x-2">
              <Tag color="purple" className="px-4 py-1">
                {record.rank}<sup>e</sup> / {record.totalStudents}
              </Tag>
              <span className="text-sm text-gray-500">
                (Moyenne classe : {record.classAverage}/20)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Appréciation',
      dataIndex: 'appreciation',
      key: 'appreciation',
      width: 250,
      render: (text) => (
        <div className="italic text-gray-600 border-l-4 border-blue-400 pl-3">
          {text}
        </div>
      ),
    }
  ];

  const renderTrimesterContent = (trimesterData) => (
    <div className="space-y-6">
      <div className="text-gray-500 mb-4">
        Période : du {new Date(trimesterData.startDate).toLocaleDateString()} au {new Date(trimesterData.endDate).toLocaleDateString()}
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title="Moyenne Générale"
            value={trimesterData.generalAverage}
            suffix="/20"
            prefix={<TrophyOutlined className="mr-2" />}
            color={trimesterData.generalAverage >= 15 ? '#3f8600' : '#cf1322'}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title="Rang dans la classe"
            value={trimesterData.generalRank}
            suffix={`sur ${trimesterData.totalStudents}`}
            prefix={<TeamOutlined className="mr-2" />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="Mentions"
            value={trimesterData.generalAverage >= 16 ? 'Très Bien' : 
                   trimesterData.generalAverage >= 14 ? 'Bien' : 
                   trimesterData.generalAverage >= 12 ? 'Assez Bien' : 'Passable'}
            prefix={<StarOutlined className="mr-2" />}
            color={trimesterData.generalAverage >= 14 ? '#3f8600' : '#faad14'}
          />
        </Col>
      </Row>

      <Card 
        bordered={false} 
        className="shadow-sm"
        title={<div className="flex items-center"><BookFilled className="mr-2" />Détail des notes par matière</div>}
      >
        <Table
          columns={columns}
          dataSource={trimesterData.grades}
          pagination={false}
          scroll={{ x: 1000 }}
          className="grades-table"
          summary={(pageData) => {
            const totalAverage = (pageData.reduce((acc, curr) => acc + curr.average, 0) / pageData.length).toFixed(2);
            return (
              <Table.Summary.Row className="font-bold bg-gray-50">
                <Table.Summary.Cell index={0}>Moyennes Générales</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2}>
                  <div className="flex items-center space-x-2">
                    <Tag color="processing" className="text-lg px-4 py-1">
                      {totalAverage}/20
                    </Tag>
                    <Tag color="purple" className="px-3">
                      {trimesterData.generalRank}<sup>e</sup> / {trimesterData.totalStudents}
                    </Tag>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );

  return (
    <AppLayout menuItems={menuItems}>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BookFilled className="text-2xl" />
          <Title level={2} className="!mb-0">Notes et Évaluations</Title>
        </div>

        <Tabs
          defaultActiveKey="1"
          type="card"
          items={[
            {
              key: '1',
              label: '1er Trimestre',
              children: renderTrimesterContent(gradesData.trimester1),
            },
            {
              key: '2',
              label: '2ème Trimestre',
              children: renderTrimesterContent(gradesData.trimester1),
            },
            {
              key: '3',
              label: '3ème Trimestre',
              children: renderTrimesterContent(gradesData.trimester1),
            },
          ]}
        />
      </div>
    </AppLayout>
  );
};

export default Grades; 