import { Card, Table, Button, Modal, Form, Input, Select, Space, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';

const { Option } = Select;

const ClassManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();

  const classesData = [
    {
      key: '1',
      name: '3ème A',
      mainTeacher: 'Prof. Martin',
      students: 25,
      level: '3ème',
      year: '2023-2024',
      room: 'Salle 101'
    },
    {
      key: '2',
      name: '3ème B',
      mainTeacher: 'Prof. Dubois',
      students: 28,
      level: '3ème',
      year: '2023-2024',
      room: 'Salle 102'
    }
  ];

  const columns = [
    {
      title: 'Classe',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Professeur principal',
      dataIndex: 'mainTeacher',
      key: 'mainTeacher',
    },
    {
      title: 'Nombre d\'élèves',
      dataIndex: 'students',
      key: 'students',
      sorter: (a, b) => a.students - b.students,
    },
    {
      title: 'Niveau',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: '6ème', value: '6ème' },
        { text: '5ème', value: '5ème' },
        { text: '4ème', value: '4ème' },
        { text: '3ème', value: '3ème' },
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: 'Salle principale',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<UserOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Détails
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    }
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    // Logique de suppression
  };

  const handleViewDetails = (record) => {
    setSelectedClass(record);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // Logique d'ajout/modification
      setIsModalVisible(false);
    });
  };

  const renderClassStats = () => {
    if (!selectedClass) return null;

    return (
      <Card title={`Détails de la classe ${selectedClass.name}`} className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="Nombre d'élèves"
              value={selectedClass.students}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Moyenne générale"
              value={14.5}
              suffix="/20"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Taux d'assiduité"
              value={95}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Nombre de matières"
              value={8}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des classes</h2>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Nouvelle classe
          </Button>
        </div>

        {renderClassStats()}

        <Card>
          <Table 
            columns={columns} 
            dataSource={classesData}
            onRow={(record) => ({
              onClick: () => handleViewDetails(record),
            })}
          />
        </Card>

        <Modal
          title={`${form.getFieldValue('key') ? 'Modifier' : 'Ajouter'} une classe`}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Nom de la classe"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="level"
              label="Niveau"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="6ème">6ème</Option>
                <Option value="5ème">5ème</Option>
                <Option value="4ème">4ème</Option>
                <Option value="3ème">3ème</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mainTeacher"
              label="Professeur principal"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Prof. Martin">Prof. Martin</Option>
                <Option value="Prof. Dubois">Prof. Dubois</Option>
                <Option value="Prof. Bernard">Prof. Bernard</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="room"
              label="Salle principale"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="year"
              label="Année scolaire"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="2023-2024">2023-2024</Option>
                <Option value="2024-2025">2024-2025</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ClassManager; 