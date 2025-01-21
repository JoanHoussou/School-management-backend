import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';
import academicService from '../../../shared/services/academicService';
import userService from '../../../shared/services/userService';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const AcademicManager = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTeachers();
    if (activeTab === 'subjects') {
      fetchSubjects();
    } else {
      fetchCurriculum();
    }
  }, [activeTab]);

  const fetchTeachers = async () => {
    try {
      const data = await userService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des professeurs:', error);
      message.error('Erreur lors de la récupération des professeurs');
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await academicService.getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      message.error('Erreur lors de la récupération des matières');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const data = await academicService.getCurriculum();
      setCurriculum(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du programme scolaire:', error);
      message.error('Erreur lors de la récupération du programme scolaire');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      message.info(`Suppression de ${record.name} à implémenter`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      message.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (activeTab === 'subjects') {
        if (editingRecord) {
          await academicService.updateSubject(editingRecord._id, values);
          message.success('Matière mise à jour avec succès');
        } else {
          await academicService.createSubject(values);
          message.success('Matière créée avec succès');
        }
        fetchSubjects();
      } else {
        if (editingRecord) {
          await academicService.updateCurriculum(editingRecord._id, values);
          message.success('Programme mis à jour avec succès');
        } else {
          await academicService.createCurriculum(values);
          message.success('Programme créé avec succès');
        }
        fetchCurriculum();
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      message.error(`Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const subjectColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Heures/Semaine',
      dataIndex: 'hoursPerWeek',
      key: 'hoursPerWeek',
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
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette matière ?"
            onConfirm={() => handleDelete(record)}
            okText="Oui"
            cancelText="Non"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const curriculumColumns = [
    {
      title: 'Matière',
      dataIndex: ['subject', 'name'],
      key: 'subject',
    },
    {
      title: 'Niveau',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Année',
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
        </Space>
      ),
    },
  ];

  const renderSubjectForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Le code est requis' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Nom"
        rules={[{ required: true, message: 'Le nom est requis' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="hoursPerWeek"
        label="Heures par semaine"
        rules={[{ required: true, message: 'Le nombre d\'heures est requis' }]}
      >
        <InputNumber min={1} max={20} />
      </Form.Item>

      <Form.Item
        name="levels"
        label="Niveaux"
        rules={[{ required: true, message: 'Au moins un niveau est requis' }]}
      >
        <Select mode="multiple">
          {['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6eme', '5eme', '4eme', '3eme'].map(level => (
            <Option key={level} value={level}>{level}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="teachers"
        label="Professeurs"
      >
        <Select mode="multiple">
          {teachers.map(teacher => (
            <Option key={teacher._id} value={teacher._id}>{teacher.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );

  return (
    <AppLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion Académique</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {activeTab === 'subjects' ? 'Nouvelle matière' : 'Nouveau programme'}
          </Button>
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Matières" key="subjects">
              <Spin spinning={loading}>
                <Table
                  columns={subjectColumns}
                  dataSource={subjects}
                  rowKey="_id"
                />
              </Spin>
            </TabPane>
            <TabPane tab="Programme scolaire" key="curriculum">
              <Spin spinning={loading}>
                <Table
                  columns={curriculumColumns}
                  dataSource={curriculum}
                  rowKey="_id"
                />
              </Spin>
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={`${editingRecord ? 'Modifier' : 'Ajouter'} ${activeTab === 'subjects' ? 'une matière' : 'un programme'}`}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
        >
          {activeTab === 'subjects' ? renderSubjectForm() : null}
        </Modal>
      </div>
    </AppLayout>
  );
};

export default AcademicManager;