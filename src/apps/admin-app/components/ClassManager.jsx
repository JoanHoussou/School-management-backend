import { Card, Table, Button, Modal, Form, Input, Select, Space, Row, Col, Statistic, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';
import classService from '../../../shared/services/classService';
import userService from '../../../shared/services/userService';

const { Option } = Select;

const ClassManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData = await userService.getAllTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Erreur lors de la récupération des professeurs:', error);
        message.error('Erreur lors de la récupération des professeurs');
      }
    };
    
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAllClasses();
      console.log('Classes récupérées:', data);
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      message.error('Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  };

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
      render: (teacher) => teacher?.name || 'Non assigné',
    },
    {
      title: 'Nombre d\'élèves',
      dataIndex: 'students',
      key: 'students',
      render: (students) => students?.length || 0,
      sorter: (a, b) => (a.students?.length || 0) - (b.students?.length || 0),
    },
    {
      title: 'Niveau',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: '6ème', value: '6eme' },
        { text: '5ème', value: '5eme' },
        { text: '4ème', value: '4eme' },
        { text: '3ème', value: '3eme' },
      ],
      onFilter: (value, record) => record.level === value,
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
            onClick={() => handleDelete(record)}
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
    console.log('Édition de la classe:', record);
    form.setFieldsValue({
      name: record.name,
      level: record.level,
      mainTeacher: record.mainTeacher?._id,
      capacity: record.capacity,
      year: record.academicYear,
      _id: record._id
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await classService.deleteClass(record._id);
      message.success('Classe supprimée avec succès');
      fetchClasses();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      message.error('Erreur lors de la suppression de la classe');
    }
  };

  const handleViewDetails = async (record) => {
    try {
      const classDetails = await classService.getClassById(record._id);
      setSelectedClass(classDetails);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      message.error('Erreur lors du chargement des détails de la classe');
    }
  };

  const handleModalOk = async () => {
    try {
      // Validation des champs du formulaire
      const values = await form.validateFields();
      console.log('Valeurs du formulaire brutes:', values);

      // Normalisation des données
      const normalizedData = {
        name: values.name.trim(),
        level: values.level,
        mainTeacher: values.mainTeacher,
        capacity: parseInt(values.capacity, 10),
        academicYear: values.year || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      };

      // Validation des données normalisées
      if (isNaN(normalizedData.capacity) || normalizedData.capacity <= 0) {
        throw new Error('La capacité doit être un nombre positif');
      }

      if (!normalizedData.name || normalizedData.name.length < 2) {
        throw new Error('Le nom de la classe doit contenir au moins 2 caractères');
      }

      if (!normalizedData.level || !['6eme', '5eme', '4eme', '3eme'].includes(normalizedData.level)) {
        throw new Error('Le niveau de la classe est invalide');
      }

      console.log('Données normalisées à envoyer au serveur:', normalizedData);

      // Envoi des données au serveur
      let response;
      if (values._id) {
        // Mise à jour d'une classe existante
        response = await classService.updateClass(values._id, normalizedData);
        console.log('Réponse de mise à jour:', response);
        message.success('Classe mise à jour avec succès');
      } else {
        // Création d'une nouvelle classe
        response = await classService.createClass(normalizedData);
        console.log('Réponse de création:', response);
        message.success('Classe créée avec succès');
      }

      // Fermeture du modal et rafraîchissement des données
      setIsModalVisible(false);
      await fetchClasses();
      
      // Réinitialisation du formulaire
      form.resetFields();
    } catch (error) {
      console.error('Erreur complète:', error);
      
      // Gestion des erreurs spécifiques
      if (error.isFieldError) {
        return; // Erreur de validation du formulaire
      }
      
      // Affichage des messages d'erreur appropriés
      const errorMessage = error.response?.data?.message ||
                         error.message ||
                         'Une erreur est survenue lors de la sauvegarde de la classe';
      
      message.error(errorMessage);
      
      // Journalisation des erreurs serveur
      if (error.response) {
        console.error('Erreur serveur:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
    }
  };

  const renderClassStats = () => {
    if (!selectedClass) return null;

    return (
      <Card title={`Détails de la classe ${selectedClass.name}`} className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="Nombre d'élèves"
              value={selectedClass.students?.length || 0}
              suffix={`/${selectedClass.capacity || 30}`}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Professeurs"
              value={selectedClass.teachers?.length || 0}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Niveau"
              value={selectedClass.level}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Professeur principal"
              value={selectedClass.mainTeacher?.name || 'Non assigné'}
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
          <Spin spinning={loading}>
            <Table 
              columns={columns} 
              dataSource={classes}
              rowKey="_id"
            />
          </Spin>
        </Card>

        <Modal
          title={`${form.getFieldValue('_id') ? 'Modifier' : 'Ajouter'} une classe`}
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
              name="_id"
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Nom de la classe"
              rules={[{ required: true, message: 'Le nom est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="level"
              label="Niveau"
              rules={[{ required: true, message: 'Le niveau est requis' }]}
            >
              <Select>
                <Option value="6eme">6ème</Option>
                <Option value="5eme">5ème</Option>
                <Option value="4eme">4ème</Option>
                <Option value="3eme">3ème</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mainTeacher"
              label="Professeur principal"
              rules={[{ required: true, message: 'Le professeur principal est requis' }]}
            >
              <Select
                placeholder="Sélectionnez un professeur principal"
                loading={loading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {teachers.map(teacher => (
                  <Option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Capacité"
              initialValue={30}
              rules={[
                { required: true, message: 'La capacité est requise' },
                { type: 'number', min: 1, max: 40, message: 'La capacité doit être entre 1 et 40' },
                { transform: (value) => Number(value) }
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="year"
              label="Année scolaire"
              rules={[{ required: true, message: 'L\'année scolaire est requise' }]}
              initialValue="2023-2024"
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