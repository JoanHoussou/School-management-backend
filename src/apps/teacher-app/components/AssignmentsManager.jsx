import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  message, 
  Tag, 
  Tooltip,
  Drawer,
  List,
  InputNumber,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckOutlined,
  FileOutlined
} from '@ant-design/icons';
import moment from 'moment';
import academicService from '../../../shared/services/academicService';
import AppLayout from '../../../shared/components/Layout';
import classService from '../../../shared/services/classService';
import assignmentService from '../../../shared/services/assignmentService';
import { menuItems } from './TeacherDashboard';

const { TextArea } = Input;
const { Title } = Typography;

const AssignmentsManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [form] = Form.useForm();
  const [gradeForm] = Form.useForm();

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const data = await academicService.getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error);
        message.error(`Erreur lors de la récupération des matières: ${error.message}`);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
        message.error(`Erreur lors de la récupération des classes: ${error.message}`);
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAllAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des devoirs:', error);
      message.error(`Erreur: ${error.message || 'Erreur lors de la récupération des devoirs'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedAssignment(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedAssignment(record);
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? moment(record.dueDate) : undefined
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await assignmentService.deleteAssignment(id);
      message.success('Devoir supprimé avec succès');
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de la suppression du devoir:', error);
      message.error(`Erreur: ${error.message || 'Erreur lors de la suppression du devoir'}`);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAssignment) {
        await assignmentService.updateAssignment(selectedAssignment._id, values);
        message.success('Devoir mis à jour avec succès');
      } else {
        await assignmentService.createAssignment(values);
        message.success('Devoir créé avec succès');
      }
      setModalVisible(false);
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du devoir:', error);
      message.error(`Erreur: ${error.message || 'Erreur lors de la sauvegarde du devoir'}`);
    }
  };

  const handleGradeSubmission = async (submissionId, values) => {
    try {
      await assignmentService.gradeAssignment(selectedAssignment._id, {
        submissionId,
        ...values
      });
      message.success('Note enregistrée avec succès');
      setDrawerVisible(false);
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la note:', error);
      message.error(`Erreur: ${error.message || 'Erreur lors de l\'enregistrement de la note'}`);
    }
  };

  const showSubmissions = (record) => {
    setSelectedAssignment(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Matière',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Classe',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Date limite',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix()
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const now = moment();
        const dueDate = moment(record.dueDate);
        const isOverdue = now.isAfter(dueDate);
        
        return (
          <Tag color={isOverdue ? 'red' : 'green'}>
            {isOverdue ? 'En retard' : 'En cours'}
          </Tag>
        );
      }
    },
    {
      title: 'Soumissions',
      key: 'submissions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => showSubmissions(record)}
        >
          {record.submissions?.length || 0} soumission(s)
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <AppLayout menuItems={menuItems}>
      <div className="assignments-container">
        <div className="header-section">
          <Title level={2}>Gestion des Devoirs</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Nouveau devoir
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={assignments}
            rowKey="_id"
            loading={loading}
          />
        </Card>

        <Modal
          title={`${selectedAssignment ? 'Modifier' : 'Créer'} un devoir`}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Le titre est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'La description est requise' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Matière"
              rules={[{ required: true, message: 'La matière est requise' }]}
              loading={loadingSubjects}
              >
              <Select>
                {subjects.map(subject => (
                  <Select.Option key={subject._id} value={subject.name}>{subject.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="class"
              label="Classe"
              rules={[{ required: true, message: 'La classe est requise' }]}
               loading={loadingClasses}
           >
              <Select>
                {classes.map(cls => <Select.Option key={cls._id} value={cls.name}>{cls.name}</Select.Option>
)}
              </Select>
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Date limite"
              rules={[{ required: true, message: 'La date limite est requise' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title="Soumissions des élèves"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={600}
        >
          {selectedAssignment && (
            <List
              itemLayout="vertical"
              dataSource={selectedAssignment.submissions || []}
              renderItem={submission => (
                <List.Item
                  actions={[
                    <Form
                      key="grade-form"
                      form={gradeForm}
                      layout="inline"
                      onFinish={(values) => handleGradeSubmission(submission._id, values)}
                      initialValues={{ grade: submission.grade }}
                    >
                      <Form.Item
                        name="grade"
                        rules={[{ required: true, message: 'La note est requise' }]}
                      >
                        <InputNumber 
                          min={0} 
                          max={20} 
                          placeholder="Note /20"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button 
                          type="primary"
                          htmlType="submit"
                          icon={<CheckOutlined />}
                        >
                          Noter
                        </Button>
                      </Form.Item>
                    </Form>
                  ]}
                >
                  <List.Item.Meta
                    title={submission.studentName}
                    description={`Soumis le ${moment(submission.submittedAt).format('DD/MM/YYYY HH:mm')}`}
                  />
                  <div>
                    <p>{submission.content}</p>
                    {submission.attachments?.map(attachment => (
                      <Tag icon={<FileOutlined />} key={attachment}>
                        {attachment}
                      </Tag>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          )}
        </Drawer>

        <style>{`
          .assignments-container {
            padding: 24px;
          }

          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default AssignmentsManager;