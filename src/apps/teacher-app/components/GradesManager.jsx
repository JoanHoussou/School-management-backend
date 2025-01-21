import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Space,
  message,
  Spin,
  Statistic,
  Row,
  Col
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import gradeService from '../../../shared/services/gradeService';
import classService from '../../../shared/services/classService';
import academicService from '../../../shared/services/academicService';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';

const { Option } = Select;

const GradesManager = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchGrades();
      fetchStats();
    }
  }, [selectedClass, selectedSubject]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      message.error('Erreur lors de la récupération des classes');
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await academicService.getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      message.error('Erreur lors de la récupération des matières');
    }
  };

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await gradeService.getClassGrades(selectedClass, {
        subject: selectedSubject
      });
      setGrades(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      message.error('Erreur lors de la récupération des notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await gradeService.getClassStats(selectedClass, {
        subject: selectedSubject
      });
      setStats(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      message.error('Erreur lors de la récupération des statistiques');
    }
  };

  const handleAdd = () => {
    setEditingGrade(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingGrade(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      values.date = values.date.toISOString();
      
      if (editingGrade) {
        await gradeService.updateGrade(editingGrade._id, values);
        message.success('Note mise à jour avec succès');
      } else {
        await gradeService.createGrade({
          ...values,
          class: selectedClass,
          subject: selectedSubject
        });
        message.success('Note ajoutée avec succès');
      }

      setIsModalVisible(false);
      fetchGrades();
      fetchStats();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      message.error('Erreur lors de la sauvegarde de la note');
    }
  };

  const columns = [
    {
      title: 'Élève',
      dataIndex: ['student', 'name'],
      key: 'student',
      sorter: (a, b) => a.student.name.localeCompare(b.student.name),
    },
    {
      title: 'Note',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Coefficient',
      dataIndex: 'coefficient',
      key: 'coefficient',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Devoir', value: 'devoir' },
        { text: 'Examen', value: 'examen' },
        { text: 'Projet', value: 'projet' },
        { text: 'Participation', value: 'participation' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  const renderStats = () => {
    if (!stats) return null;

    return (
      <Card className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Moyenne de classe"
              value={stats.average}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Médiane"
              value={stats.median}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Note la plus haute"
              value={stats.highest}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Note la plus basse"
              value={stats.lowest}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const content = (
    <div className="p-6">
      <Card className="mb-4">
        <Space size="large">
          <Select
            placeholder="Sélectionnez une classe"
            style={{ width: 200 }}
            onChange={setSelectedClass}
            value={selectedClass}
          >
            {classes.map(c => (
              <Option key={c._id} value={c._id}>{c.name}</Option>
            ))}
          </Select>

          <Select
            placeholder="Sélectionnez une matière"
            style={{ width: 200 }}
            onChange={setSelectedSubject}
            value={selectedSubject}
          >
            {subjects.map(s => (
              <Option key={s._id} value={s._id}>{s.name}</Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!selectedClass || !selectedSubject}
          >
            Ajouter une note
          </Button>
        </Space>
      </Card>

      {renderStats()}

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={grades}
            rowKey="_id"
          />
        </Spin>
      </Card>

      <Modal
        title={`${editingGrade ? 'Modifier' : 'Ajouter'} une note`}
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
            name="student"
            label="Élève"
            rules={[{ required: true, message: 'Veuillez sélectionner un élève' }]}
          >
            <Select placeholder="Sélectionnez un élève">
              {selectedClass && classes
                .find(c => c._id === selectedClass)?.students
                .map(student => (
                  <Option key={student._id} value={student._id}>
                    {student.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Note"
            rules={[
              { required: true, message: 'La note est requise' },
              { type: 'number', min: 0, max: 20, message: 'La note doit être entre 0 et 20' }
            ]}
          >
            <InputNumber min={0} max={20} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="coefficient"
            label="Coefficient"
            rules={[{ required: true, message: 'Le coefficient est requis' }]}
            initialValue={1}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Le type est requis' }]}
          >
            <Select>
              <Option value="devoir">Devoir</Option>
              <Option value="examen">Examen</Option>
              <Option value="projet">Projet</Option>
              <Option value="participation">Participation</Option>
              <Option value="autre">Autre</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="term"
            label="Trimestre"
            rules={[{ required: true, message: 'Le trimestre est requis' }]}
          >
            <Select>
              <Option value="T1">Trimestre 1</Option>
              <Option value="T2">Trimestre 2</Option>
              <Option value="T3">Trimestre 3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'La date est requise' }]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  return <AppLayout menuItems={menuItems}>{content}</AppLayout>;
};

export default GradesManager;