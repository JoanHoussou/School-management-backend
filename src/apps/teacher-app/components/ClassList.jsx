import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Tooltip,
  Space,
  Popconfirm,
  Badge,
  Empty,
  Statistic,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  CalculatorOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';

const { Title, Text } = Typography;
const { Option } = Select;

const ClassList = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAddColumnVisible, setIsAddColumnVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCell, setEditingCell] = useState(null);

  // Données simulées
  const classesData = {
    '3ème A': {
      students: [
        { 
          id: 1, 
          name: 'Thomas Dubois',
          grades: [],
          attendance: 95,
          rank: 1,
          trend: 'up',
          lastGrade: 16,
          trimesters: {
            1: { average: 15.5, rank: 2, appreciation: "Excellent trimestre" },
            2: { average: 16.2, rank: 1, appreciation: "Continue ainsi" },
            3: { average: null, rank: null, appreciation: null }
          }
        },
        { 
          id: 2, 
          name: 'Marie Martin',
          grades: [],
          attendance: 92,
          rank: 2,
          trend: 'stable',
          lastGrade: 15,
          trimesters: {
            1: { average: 14.5, rank: 3, appreciation: "Bon trimestre" },
            2: { average: 15.0, rank: 2, appreciation: "Bonne progression" },
            3: { average: null, rank: null, appreciation: null }
          }
        }
      ],
      evaluations: [],
      stats: {
        average: 14.8,
        aboveAverage: 15,
        belowAverage: 10,
        bestGrade: 18,
        worstGrade: 8,
        trimesters: {
          1: { average: 14.2, completed: true },
          2: { average: 14.8, completed: true },
          3: { average: null, completed: false }
        }
      }
    },
    '4ème B': {
      students: [
        { 
          id: 3, 
          name: 'Lucas Bernard',
          grades: [],
          attendance: 88,
          rank: 1,
          trend: 'down',
          lastGrade: 13,
          trimesters: {
            1: { average: 14.0, rank: 1, appreciation: "Peut mieux faire" },
            2: { average: 13.5, rank: 1, appreciation: "En baisse" },
            3: { average: null, rank: null, appreciation: null }
          }
        }
      ],
      evaluations: [],
      stats: {
        average: 13.5,
        aboveAverage: 12,
        belowAverage: 8,
        bestGrade: 16,
        worstGrade: 10,
        trimesters: {
          1: { average: 14.0, completed: true },
          2: { average: 13.5, completed: true },
          3: { average: null, completed: false }
        }
      }
    }
  };

  const [classes, setClasses] = useState(classesData);

  const handleAddEvaluation = (values) => {
    const newEvaluation = {
      id: Date.now(),
      title: values.title,
      type: values.type,
      coefficient: values.coefficient,
      date: values.date
    };

    setClasses(prev => {
      const updatedClass = {...prev[selectedClass]};
      updatedClass.evaluations.push(newEvaluation);
      updatedClass.students.forEach(student => {
        student.grades.push({ evaluationId: newEvaluation.id, value: null });
      });
      return {
        ...prev,
        [selectedClass]: updatedClass
      };
    });

    setIsAddColumnVisible(false);
    form.resetFields();
  };

  const handleGradeChange = (studentId, evaluationId, value) => {
    setClasses(prev => {
      const updatedClass = {...prev[selectedClass]};
      const student = updatedClass.students.find(s => s.id === studentId);
      const gradeIndex = student.grades.findIndex(g => g.evaluationId === evaluationId);
      
      if (gradeIndex > -1) {
        student.grades[gradeIndex].value = value;
      } else {
        student.grades.push({ evaluationId, value });
      }

      return {
        ...prev,
        [selectedClass]: updatedClass
      };
    });
  };

  const calculateAverage = (grades, evaluations) => {
    if (!grades.length) return '-';
    
    let totalWeight = 0;
    let totalValue = 0;

    grades.forEach(grade => {
      if (grade.value !== null) {
        const evaluation = evaluations.find(e => e.id === grade.evaluationId);
        if (evaluation) {
          totalWeight += evaluation.coefficient;
          totalValue += grade.value * evaluation.coefficient;
        }
      }
    });

    return totalWeight ? (totalValue / totalWeight).toFixed(2) : '-';
  };

  const getColumns = () => {
    if (!selectedClass) return [];

    const baseColumns = [
      {
        title: 'Élève',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        render: (text) => (
          <div className="student-name">
            <UserOutlined className="mr-2" />
            {text}
          </div>
        )
      }
    ];

    const gradeColumns = classes[selectedClass].evaluations.map(evaluation => ({
      title: (
        <div className="evaluation-header">
          <div className="font-medium">{evaluation.title}</div>
          <div className="text-xs text-gray-500">
            <Tag color="blue">Coef. {evaluation.coefficient}</Tag>
          </div>
          <div className="text-xs text-gray-500">{evaluation.type}</div>
        </div>
      ),
      dataIndex: ['grades'],
      width: 120,
      render: (grades, student) => {
        const grade = grades.find(g => g.evaluationId === evaluation.id);
        return (
          <div className="grade-cell" onClick={() => setEditingCell({ studentId: student.id, evaluationId: evaluation.id })}>
            {editingCell?.studentId === student.id && editingCell?.evaluationId === evaluation.id ? (
              <InputNumber
                autoFocus
                min={0}
                max={20}
                size="small"
                value={grade?.value}
                onChange={value => {
                  handleGradeChange(student.id, evaluation.id, value);
                  setEditingCell(null);
                }}
                onBlur={() => setEditingCell(null)}
                onPressEnter={() => setEditingCell(null)}
              />
            ) : (
              <Tag 
                color={
                  !grade?.value ? 'default' :
                  grade.value >= 15 ? 'success' :
                  grade.value >= 10 ? 'processing' :
                  'error'
                }
                className="grade-tag"
              >
                {grade?.value ?? '-'}/20
              </Tag>
            )}
          </div>
        );
      }
    }));

    const averageColumn = {
      title: (
        <div className="average-header">
          <div className="average-title">
            <CalculatorOutlined />
            <span>Moyenne</span>
          </div>
          <div className="average-subtitle">
            (coefficient inclus)
          </div>
        </div>
      ),
      fixed: 'right',
      width: 120,
      render: (_, student) => {
        const avg = calculateAverage(student.grades, classes[selectedClass].evaluations);
        return (
          <div className="average-cell">
            <Tag color={
              avg === '-' ? 'default' :
              avg >= 15 ? 'success' :
              avg >= 10 ? 'processing' :
              'error'
            } className="average-tag">
              {avg}/20
            </Tag>
          </div>
        );
      }
    };

    return [...baseColumns, ...gradeColumns, averageColumn];
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="class-list-container">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Liste des classes</Title>
          {selectedClass && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddColumnVisible(true)}
            >
              Ajouter une évaluation
            </Button>
          )}
        </div>

        {/* Statistiques horizontales */}
        {selectedClass && classes[selectedClass]?.stats && (
          <Card className="stats-overview-card mb-6">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Statistic
                  title="Moyenne générale"
                  value={classes[selectedClass].stats.average}
                  precision={1}
                  suffix="/20"
                  prefix={<TrophyOutlined className="text-gold" />}
                />
              </Col>
              <Col xs={24} sm={16} md={18}>
                <div className="trimester-stats-horizontal">
                  {[1, 2, 3].map(trimester => (
                    <div key={trimester} className="trimester-stat">
                      <Text strong className="trimester-title">T{trimester}</Text>
                      <div className="trimester-value">
                        {classes[selectedClass].stats.trimesters[trimester]?.average 
                          ? `${classes[selectedClass].stats.trimesters[trimester].average}/20`
                          : '-'
                        }
                      </div>
                      <Tag color={
                        classes[selectedClass].stats.trimesters[trimester]?.completed
                          ? 'success'
                          : 'processing'
                      } className="trimester-status">
                        {classes[selectedClass].stats.trimesters[trimester]?.completed
                          ? 'Terminé'
                          : 'En cours'
                        }
                      </Tag>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Row gutter={[16, 16]}>
          {/* Liste des classes */}
          <Col xs={24} md={6}>
            <Card title="Classes" className="classes-card">
              {Object.keys(classes).map(className => (
                <div
                  key={className}
                  className={`class-item ${selectedClass === className ? 'selected' : ''}`}
                  onClick={() => setSelectedClass(className)}
                >
                  <TeamOutlined className="class-icon" />
                  <div className="class-info">
                    <div className="class-name">{className}</div>
                    <div className="class-stats">
                      {classes[className].students.length} élèves
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </Col>

          {/* Tableau des notes */}
          <Col xs={24} md={18}>
            {selectedClass ? (
              <>
                <Card className="class-overview-card mb-4">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic
                        title="Élèves au-dessus de la moyenne"
                        value={classes[selectedClass].stats.aboveAverage}
                        suffix={`/${classes[selectedClass].students.length}`}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Meilleure note"
                        value={classes[selectedClass].stats.bestGrade}
                        suffix="/20"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Note la plus basse"
                        value={classes[selectedClass].stats.worstGrade}
                        suffix="/20"
                        valueStyle={{ color: '#cf1322' }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card 
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" />
                        Notes - {selectedClass}
                      </div>
                      <Select defaultValue="3" style={{ width: 140 }}>
                        <Option value="1">Trimestre 1</Option>
                        <Option value="2">Trimestre 2</Option>
                        <Option value="3">Trimestre 3</Option>
                      </Select>
                    </div>
                  }
                  className="grades-card"
                >
                  <Table
                    columns={getColumns()}
                    dataSource={classes[selectedClass].students}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    rowKey="id"
                    className="grades-table"
                  />
                </Card>
              </>
            ) : (
              <Card className="empty-state">
                <Empty
                  description="Sélectionnez une classe pour voir les notes"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            )}
          </Col>
        </Row>

        {/* Modal d'ajout d'évaluation */}
        <Modal
          title="Nouvelle évaluation"
          open={isAddColumnVisible}
          onOk={() => form.submit()}
          onCancel={() => setIsAddColumnVisible(false)}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddEvaluation}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ex: Contrôle Chapitre 5" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Sélectionner un type">
                    <Option value="Contrôle">Contrôle</Option>
                    <Option value="DM">Devoir Maison</Option>
                    <Option value="TP">TP</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="coefficient"
                  label="Coefficient"
                  rules={[{ required: true }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={5} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>

      <style jsx global>{`
        .class-list-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .classes-card {
          height: 100%;
        }

        .class-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 8px;
        }

        .class-item:hover {
          background: #f5f5f5;
        }

        .class-item.selected {
          background: #e6f7ff;
          border-right: 3px solid #1890ff;
        }

        .class-icon {
          font-size: 24px;
          color: #1890ff;
          margin-right: 12px;
        }

        .class-info {
          flex: 1;
        }

        .class-name {
          font-weight: 500;
        }

        .class-stats {
          font-size: 12px;
          color: #666;
        }

        .grades-card {
          min-height: 400px;
        }

        .evaluation-header {
          text-align: center;
        }

        .grade-cell {
          text-align: center;
          cursor: pointer;
          padding: 4px;
        }

        .grade-cell:hover {
          background: #fafafa;
        }

        .grade-tag {
          min-width: 60px;
        }

        .average-cell {
          text-align: center;
        }

        .average-tag {
          min-width: 70px;
        }

        .empty-state {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .grades-table .ant-table-cell {
          padding: 12px !important;
        }

        @media (max-width: 768px) {
          .class-list-container {
            padding: 16px;
          }
        }

        .class-stats-card {
          background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
        }

        .text-gold {
          color: #ffd700;
        }

        .trimester-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trimester-block {
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trimester-average {
          font-size: 18px;
          font-weight: 500;
          color: #1890ff;
        }

        .class-overview-card {
          background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
          border-radius: 12px;
        }

        .student-row {
          transition: all 0.3s;
        }

        .student-row:hover {
          background: #f5f5f5;
        }

        .student-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .student-rank {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 10px;
          background: #f0f0f0;
        }

        .trend-icon {
          font-size: 12px;
          margin-left: 4px;
        }

        .trend-up {
          color: #52c41a;
        }

        .trend-down {
          color: #f5222d;
        }

        .stats-overview-card {
          background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
          border-radius: 12px;
        }

        .trimester-stats-horizontal {
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: flex-end;
        }

        .trimester-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 100px;
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
        }

        .trimester-title {
          font-size: 16px;
          color: #666;
        }

        .trimester-value {
          font-size: 18px;
          font-weight: 500;
          color: #1890ff;
        }

        .trimester-status {
          min-width: 70px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .trimester-stats-horizontal {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 8px;
          }
        }

        .average-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .average-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          color: #1890ff;
        }

        .average-subtitle {
          font-size: 11px;
          color: #8c8c8c;
          font-weight: normal;
        }

        .average-cell {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .average-tag {
          min-width: 70px;
          text-align: center;
          font-weight: 500;
          font-size: 14px;
        }
      `}</style>
    </AppLayout>
  );
};

export default ClassList; 