import { Card, Tabs, Table, Button, Modal, Form, Input, Select, TimePicker, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';

const { TabPane } = Tabs;
const { Option } = Select;

const AcademicManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('subjects');
  const [form] = Form.useForm();

  const academicData = {
    subjects: [
      {
        key: '1',
        name: 'Mathématiques',
        code: 'MATH',
        level: 'Collège',
        teachers: ['Prof. Martin', 'Prof. Bernard']
      },
      {
        key: '2',
        name: 'Français',
        code: 'FR',
        level: 'Collège',
        teachers: ['Prof. Dubois']
      }
    ],
    schedules: [
      {
        key: '1',
        class: '3ème A',
        subject: 'Mathématiques',
        teacher: 'Prof. Martin',
        day: 'Lundi',
        timeSlot: '08:00-10:00',
        room: 'Salle 101'
      },
      {
        key: '2',
        class: '3ème A',
        subject: 'Français',
        teacher: 'Prof. Dubois',
        day: 'Lundi',
        timeSlot: '10:00-12:00',
        room: 'Salle 102'
      }
    ]
  };

  const columns = {
    subjects: [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Niveau',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: 'Enseignants',
        dataIndex: 'teachers',
        key: 'teachers',
        render: (teachers) => teachers.join(', '),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
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
    ],
    schedules: [
      {
        title: 'Classe',
        dataIndex: 'class',
        key: 'class',
        filters: [
          { text: '3ème A', value: '3ème A' },
          { text: '3ème B', value: '3ème B' },
        ],
        onFilter: (value, record) => record.class === value,
      },
      {
        title: 'Matière',
        dataIndex: 'subject',
        key: 'subject',
      },
      {
        title: 'Enseignant',
        dataIndex: 'teacher',
        key: 'teacher',
      },
      {
        title: 'Jour',
        dataIndex: 'day',
        key: 'day',
      },
      {
        title: 'Horaire',
        dataIndex: 'timeSlot',
        key: 'timeSlot',
      },
      {
        title: 'Salle',
        dataIndex: 'room',
        key: 'room',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
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
    ]
  };

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

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // Logique d'ajout/modification
      setIsModalVisible(false);
    });
  };

  const renderForm = () => {
    const forms = {
      subjects: (
        <>
          <Form.Item
            name="name"
            label="Nom de la matière"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
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
              <Option value="Collège">Collège</Option>
              <Option value="Lycée">Lycée</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="teachers"
            label="Enseignants"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              <Option value="Prof. Martin">Prof. Martin</Option>
              <Option value="Prof. Dubois">Prof. Dubois</Option>
              <Option value="Prof. Bernard">Prof. Bernard</Option>
            </Select>
          </Form.Item>
        </>
      ),
      schedules: (
        <>
          <Form.Item
            name="class"
            label="Classe"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="3ème A">3ème A</Option>
              <Option value="3ème B">3ème B</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="Matière"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Mathématiques">Mathématiques</Option>
              <Option value="Français">Français</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher"
            label="Enseignant"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Prof. Martin">Prof. Martin</Option>
              <Option value="Prof. Dubois">Prof. Dubois</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="day"
            label="Jour"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Lundi">Lundi</Option>
              <Option value="Mardi">Mardi</Option>
              <Option value="Mercredi">Mercredi</Option>
              <Option value="Jeudi">Jeudi</Option>
              <Option value="Vendredi">Vendredi</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="timeSlot"
            label="Horaire"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="room"
            label="Salle"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </>
      )
    };

    return forms[currentTab] || null;
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion académique</h2>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {currentTab === 'subjects' ? 'Nouvelle matière' : 'Nouveau cours'}
          </Button>
        </div>

        <Card>
          <Tabs 
            activeKey={currentTab}
            onChange={setCurrentTab}
          >
            <TabPane tab="Matières" key="subjects">
              <Table 
                columns={columns.subjects} 
                dataSource={academicData.subjects}
              />
            </TabPane>
            <TabPane tab="Emplois du temps" key="schedules">
              <Table 
                columns={columns.schedules} 
                dataSource={academicData.schedules}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={`${form.getFieldValue('key') ? 'Modifier' : 'Ajouter'} ${
            currentTab === 'subjects' ? 'une matière' : 'un cours'
          }`}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            {renderForm()}
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default AcademicManager; 