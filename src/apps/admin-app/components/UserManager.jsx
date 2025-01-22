import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Tabs, Row, Col, Statistic, message } from 'antd';
import { Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';
import userService from '../../../shared/services/userService';
import 'moment/locale/fr';
import '../../../styles/admin/UserManager.css';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const UserManager = () => {
  const [usersData, setUsersData] = useState({
    students: [],
    teachers: [],
    parents: []
  });
  const [filteredData, setFilteredData] = useState({
    students: [],
    teachers: [],
    parents: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserType, setCurrentUserType] = useState('students');
  const [form] = Form.useForm();

  const handleSearch = (value = '') => {
    const searchLower = value.toLowerCase();

    const filtered = {
      students: usersData.students.filter(student =>
        (student.name?.toLowerCase() || '').includes(searchLower) ||
        (student.email?.toLowerCase() || '').includes(searchLower) ||
        (student.class?.toLowerCase() || '').includes(searchLower) ||
        (student.parentEmail?.toLowerCase() || '').includes(searchLower)
      ),
      teachers: usersData.teachers.filter(teacher =>
        (teacher.name?.toLowerCase() || '').includes(searchLower) ||
        (teacher.email?.toLowerCase() || '').includes(searchLower) ||
        (teacher.subjects || []).some(subject => 
          (subject?.toLowerCase() || '').includes(searchLower)
        )
      ),
      parents: usersData.parents.filter(parent =>
        (parent.name?.toLowerCase() || '').includes(searchLower) ||
        (parent.email?.toLowerCase() || '').includes(searchLower)
      )
    };

    setFilteredData(filtered);
  };

  const columns = {
    students: [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: 'Classe',
        dataIndex: 'class',
        key: 'class',
        sorter: (a, b) => a.class.localeCompare(b.class),
        render: (className) => (
          <Tag color="blue">{className}</Tag>
        ),
      },
      {
        title: 'Parent',
        dataIndex: 'parentEmail',
        key: 'parentEmail',
        sorter: (a, b) => a.parentEmail.localeCompare(b.parentEmail),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => (
          <Tag color={status === 'actif' ? 'green' : 'red'}>
            {status}
          </Tag>
        ),
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
      },
    ],
    teachers: [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: 'Matières',
        dataIndex: 'subjects',
        key: 'subjects',
        sorter: (a, b) => a.subjects[0]?.localeCompare(b.subjects[0] || ''),
        render: (subjects) => (
          <>
            {subjects.map(subject => (
              <Tag key={subject} color="green">{subject}</Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => (
          <Tag color={status === 'actif' ? 'green' : 'red'}>
            {status}
          </Tag>
        ),
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
      },
    ],
    parents: [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: 'Enfants',
        dataIndex: 'children',
        key: 'children',
        render: (children) => (
          <>
            {usersData.students
              .filter(student => children.includes(student.key))
              .map(student => <Tag key={student.key}>{student.name}</Tag>)}
          </>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => (
          <Tag color={status === 'actif' ? 'green' : 'red'}>
            {status}
          </Tag>
        ),
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
      },
    ],
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      async onOk() {
        try {
          await userService.deleteUser(userId);
          message.success('Utilisateur supprimé avec succès');
          loadUsers();
        } catch (error) {
          message.error('Erreur lors de la suppression : ' + error.message);
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const userData = {
          ...values,
          isActive: true,
          role: currentUserType === 'students' ? 'student' : 
                currentUserType === 'teachers' ? 'teacher' : 'parent'
        };

        if (form.getFieldValue('key')) {
          await userService.updateUser(form.getFieldValue('key'), userData);
          message.success('Utilisateur modifié avec succès');
        } else {
          await userService.createUser(userData);
          message.success('Utilisateur créé avec succès');
        }

        setIsModalVisible(false);
        form.resetFields();
        loadUsers();
      } catch (error) {
        message.error('Erreur : ' + error.message);
      }
    });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const [students, teachers, parents] = await Promise.all([
        userService.getAllStudents(),
        userService.getAllTeachers(),
        userService.getAllParents()
      ]);

      const formattedStudents = students.map(student => ({
        key: student._id,
        name: student.name,
        email: student.email,
        class: student.class || '',
        status: student.isActive ? 'actif' : 'inactif',
        parentEmail: student.parentEmail
      }));

      const formattedTeachers = teachers.map(teacher => ({
        key: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects || [],
        status: teacher.isActive ? 'actif' : 'inactif'
      }));

      const formattedParents = parents.map(parent => ({
        key: parent._id,
        name: parent.name,
        email: parent.email,
        children: parent.children.map(child => child._id),
        status: parent.isActive ? 'actif' : 'inactif'
      }));

      setUsersData({
        students: formattedStudents,
        teachers: formattedTeachers,
        parents: formattedParents
      });
    } catch (error) {
      message.error('Erreur lors du chargement des utilisateurs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setFilteredData(usersData);
  }, [usersData]);

  const renderForm = () => {
    const formItems = {
      students: (
        <>
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Le mot de passe est requis' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: "Le nom d'utilisateur est requis" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="class"
            label="Classe"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="6ème A">6ème A</Option>
              <Option value="6ème B">6ème B</Option>
              <Option value="5ème A">5ème A</Option>
              <Option value="5ème B">5ème B</Option>
              <Option value="4ème A">4ème A</Option>
              <Option value="4ème B">4ème B</Option>
              <Option value="3ème A">3ème A</Option>
              <Option value="3ème B">3ème B</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="parentEmail"
            label="Email du parent"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
        </>
      ),
      teachers: (
        <>
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Le mot de passe est requis' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: "Le nom d'utilisateur est requis" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subjects"
            label="Matières"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              <Option value="Mathématiques">Mathématiques</Option>
              <Option value="Français">Français</Option>
              <Option value="Histoire-Géographie">Histoire-Géographie</Option>
              <Option value="Physique-Chimie">Physique-Chimie</Option>
              <Option value="SVT">SVT</Option>
              <Option value="Anglais">Anglais</Option>
              <Option value="Espagnol">Espagnol</Option>
              <Option value="Arts Plastiques">Arts Plastiques</Option>
              <Option value="Musique">Musique</Option>
              <Option value="EPS">EPS</Option>
            </Select>
          </Form.Item>
        </>
      ),
      parents: (
        <>
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Le mot de passe est requis' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: "Le nom d'utilisateur est requis" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="children"
            label="Enfants"
            rules={[{ required: true, message: 'Veuillez sélectionner au moins un enfant' }]}
          >
            <Select mode="multiple">
              {usersData.students.map(student => (
                <Option key={student.key} value={student.key}>{student.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ),
    };

    return formItems[currentUserType] || null;
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="user-manager-container">
        <div className="header-section">
          <div className="title-section">
            <Title level={2}>Gestion des utilisateurs</Title>
            <Text type="secondary">
              {usersData.students.length + usersData.teachers.length + usersData.parents.length} utilisateurs au total
            </Text>
          </div>
          <Space>
            <Select 
              defaultValue="all" 
              style={{ width: 120 }}
              className="filter-select"
            >
              <Option value="all">Tous</Option>
              <Option value="active">Actifs</Option>
              <Option value="inactive">Inactifs</Option>
            </Select>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="add-button"
            >
              Nouvel utilisateur
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={24} sm={8}>
            <Card className="stat-card students-stat">
              <Statistic
                title={<Space><TeamOutlined /> Élèves</Space>}
                value={usersData.students.length}
                suffix={
                  <Tag color="blue">
                    {usersData.students.filter(u => u.status === 'actif').length} actifs
                  </Tag>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card teachers-stat">
              <Statistic
                title={<Space><BookOutlined /> Enseignants</Space>}
                value={usersData.teachers.length}
                suffix={
                  <Tag color="green">
                    {usersData.teachers.filter(u => u.status === 'actif').length} actifs
                  </Tag>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card parents-stat">
              <Statistic
                title={<Space><UserOutlined /> Parents</Space>}
                value={usersData.parents.length}
                suffix={
                  <Tag color="purple">
                    {usersData.parents.filter(u => u.status === 'actif').length} actifs
                  </Tag>
                }
              />
            </Card>
          </Col>
        </Row>

        <Card className="main-card">
          <Tabs 
            activeKey={currentUserType}
            onChange={setCurrentUserType}
            type="card"
            className="user-tabs"
            tabBarExtraContent={
              <Input.Search
                placeholder="Rechercher..."
                style={{ width: 250 }}
                className="search-input"
                allowClear
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            }
          >
            <TabPane 
              tab={
                <span>
                  <TeamOutlined />
                  Élèves
                </span>
              } 
              key="students"
            >
              <Table 
                columns={columns.students} 
                dataSource={filteredData.students}
                loading={loading}
                className="user-table"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <BookOutlined />
                  Enseignants
                </span>
              } 
              key="teachers"
            >
              <Table 
                columns={columns.teachers} 
                dataSource={filteredData.teachers}
                loading={loading}
                className="user-table"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  Parents
                </span>
              } 
              key="parents"
            >
              <Table 
                columns={columns.parents} 
                dataSource={filteredData.parents}
                loading={loading}
                className="user-table"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={
            <Space>
              {form.getFieldValue('key') ? <EditOutlined /> : <PlusOutlined />}
              <span>{form.getFieldValue('key') ? 'Modifier' : 'Ajouter'} un utilisateur</span>
            </Space>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={700}
          className="user-modal"
        >
          <Form
            form={form}
            layout="vertical"
            className="user-form"
          >
            {renderForm()}
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default UserManager; 