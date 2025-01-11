import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Tag, 
  Space,
  Row,
  Col,
  Typography,
  Progress,
  Tooltip,
  Badge,
  Statistic,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  WarningOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const AssignmentsManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const classesPerPage = 3; // Nombre de classes affichées à la fois

  const assignmentsData = {
    stats: {
      total: 45,
      pending: 12,
      completed: 28,
      late: 5
    },
    byClass: [
      { class: '3ème A', total: 15, completed: 12 },
      { class: '4ème B', total: 15, completed: 8 },
      { class: '3ème C', total: 15, completed: 8 },
      { class: '4ème A', total: 12, completed: 10 },
      { class: '5ème B', total: 18, completed: 15 },
      { class: '6ème A', total: 14, completed: 11 }
    ],
    assignments: [
      {
        key: '1',
        title: 'Contrôle de mathématiques',
        class: '3ème A',
        dueDate: '2024-03-25',
        type: 'Contrôle',
        status: 'À venir',
        description: 'Chapitre 5 - Fonctions dérivées',
        submissions: 0,
        totalStudents: 25
      },
      {
        key: '2',
        title: 'Devoir maison',
        class: '4ème B',
        dueDate: '2024-03-22',
        type: 'DM',
        status: 'En cours',
        description: 'Exercices sur le théorème de Pythagore',
        submissions: 15,
        totalStudents: 28
      }
    ]
  };

  const columns = [
    {
      title: 'Devoir',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="assignment-title">
          <div className="font-medium">{text}</div>
          <Text type="secondary" className="text-sm">{record.description}</Text>
        </div>
      )
    },
    {
      title: 'Classe',
      dataIndex: 'class',
      key: 'class',
      render: (text) => (
        <Tag color="blue" className="class-tag">
          <TeamOutlined /> {text}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Contrôle' ? 'red' : 'green'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Date limite',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <div className="due-date">
          <CalendarOutlined className="mr-2" />
          {new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long'
          })}
        </div>
      )
    },
    {
      title: 'Progression',
      key: 'progress',
      render: (_, record) => (
        <div className="progress-column">
          <Progress 
            percent={Math.round((record.submissions / record.totalStudents) * 100)} 
            size="small"
            format={(percent) => `${record.submissions}/${record.totalStudents}`}
          />
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button 
              type="text"
              icon={<DeleteOutlined />} 
              danger
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleAdd = () => {
    setEditingAssignment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAssignment(record);
    form.setFieldsValue({
      ...record,
      dueDate: dayjs(record.dueDate)
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce devoir ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: () => {
        setAssignments(prev => prev.filter(item => item.key !== key));
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        key: editingAssignment?.key || Date.now().toString(),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        submissions: editingAssignment?.submissions || 0,
        totalStudents: editingAssignment?.totalStudents || 25
      };

      setAssignmentsData(prev => {
        const newAssignments = [...prev.assignments];
        const index = newAssignments.findIndex(item => item.key === formattedValues.key);
        
        if (index > -1) {
          newAssignments[index] = formattedValues;
        } else {
          newAssignments.push(formattedValues);
        }
        
        return {
          ...prev,
          assignments: newAssignments
        };
      });

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handlePrevClasses = () => {
    setCurrentClassIndex(prev => Math.max(0, prev - classesPerPage));
  };

  const handleNextClasses = () => {
    setCurrentClassIndex(prev => 
      Math.min(assignmentsData.byClass.length - classesPerPage, prev + classesPerPage)
    );
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="assignments-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-0">Gestion des devoirs</Title>
            <Text type="secondary">Année scolaire 2023-2024</Text>
          </div>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size="large"
          >
            Nouveau devoir
          </Button>
        </div>

        {/* Widgets statistiques */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Total des devoirs"
                value={assignmentsData.stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="En attente"
                value={assignmentsData.stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Terminés"
                value={assignmentsData.stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="En retard"
                value={assignmentsData.stats.late}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Progression par classe */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={24}>
            <Card 
              title={
                <div className="card-title">
                  <BookOutlined className="mr-2" />
                  Progression par classe
                </div>
              }
              extra={
                <div className="flex items-center space-x-2">
                  <Button 
                    type="text" 
                    icon={<LeftOutlined />} 
                    onClick={handlePrevClasses}
                    disabled={currentClassIndex === 0}
                    className="nav-button"
                  />
                  <Button 
                    type="text" 
                    icon={<RightOutlined />} 
                    onClick={handleNextClasses}
                    disabled={currentClassIndex >= assignmentsData.byClass.length - classesPerPage}
                    className="nav-button"
                  />
                </div>
              }
              bordered={false}
            >
              <div className="classes-slider">
                <Row gutter={[32, 16]}>
                  {assignmentsData.byClass
                    .slice(currentClassIndex, currentClassIndex + classesPerPage)
                    .map((classData, index) => (
                      <Col key={index} xs={24} md={8}>
                        <div className="class-progress-card">
                          <div className="flex justify-between items-center mb-2">
                            <Text strong>{classData.class}</Text>
                            <Tag color="blue">{classData.completed}/{classData.total}</Tag>
                          </div>
                          <Progress 
                            percent={Math.round((classData.completed / classData.total) * 100)}
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Liste des devoirs */}
        <Card 
          bordered={false}
          className="assignments-table-card"
          title={
            <div className="card-title">
              <FileTextOutlined className="mr-2" />
              Liste des devoirs
            </div>
          }
        >
          <Table 
            columns={columns} 
            dataSource={assignmentsData.assignments}
            className="assignments-table"
          />
        </Card>

        {/* Modal du formulaire */}
        <Modal
          title={
            <Text strong>
              {editingAssignment ? 'Modifier le devoir' : 'Nouveau devoir'}
            </Text>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            className="assignment-form"
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input placeholder="Titre du devoir" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez ajouter une description' }]}
            >
              <Input.TextArea 
                placeholder="Description détaillée du devoir"
                rows={4}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="class"
                  label="Classe"
                  rules={[{ required: true, message: 'Veuillez sélectionner une classe' }]}
                >
                  <Select placeholder="Sélectionner une classe">
                    <Option value="3ème A">3ème A</Option>
                    <Option value="4ème B">4ème B</Option>
                    <Option value="3ème C">3ème C</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
                >
                  <Select placeholder="Sélectionner un type">
                    <Option value="Contrôle">Contrôle</Option>
                    <Option value="DM">Devoir maison</Option>
                    <Option value="TP">TP</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dueDate"
                  label="Date limite"
                  rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD/MM/YYYY"
                    placeholder="Sélectionner une date"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                >
                  <Select placeholder="Sélectionner un statut">
                    <Option value="À venir">À venir</Option>
                    <Option value="En cours">En cours</Option>
                    <Option value="Terminé">Terminé</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>

      <style jsx global>{`
        .assignments-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .stat-card {
          border-radius: 8px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .class-progress-card {
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          transition: all 0.3s;
          height: 100%;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .class-progress-card:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .assignments-table-card {
          border-radius: 8px;
          overflow: hidden;
        }

        .assignments-table .ant-table-cell {
          padding: 16px !important;
        }

        .assignment-title {
          max-width: 300px;
        }

        .due-date {
          white-space: nowrap;
        }

        .progress-column {
          min-width: 150px;
        }

        .class-tag {
          font-size: 12px;
          padding: 4px 8px;
        }

        @media (max-width: 768px) {
          .assignments-container {
            padding: 16px;
          }
        }

        .assignment-form .ant-form-item {
          margin-bottom: 16px;
        }

        .assignment-form .ant-input,
        .assignment-form .ant-select-selector,
        .assignment-form .ant-picker {
          border-radius: 6px;
        }

        .assignment-form .ant-input:hover,
        .assignment-form .ant-select-selector:hover,
        .assignment-form .ant-picker:hover {
          border-color: #1890ff;
        }

        .assignment-form .ant-form-item-label > label {
          font-weight: 500;
        }

        .classes-slider {
          position: relative;
          overflow: hidden;
        }

        .nav-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .nav-button:hover:not(:disabled) {
          background: #f0f0f0;
          color: #1890ff;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .classes-slider {
            overflow-x: auto;
            padding-bottom: 16px;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default AssignmentsManager; 