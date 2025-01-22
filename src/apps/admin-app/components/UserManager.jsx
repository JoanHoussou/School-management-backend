import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Tabs, Row, Col, Statistic, Breadcrumb, message, Calendar, Badge, Tooltip } from 'antd';
import { Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, BookOutlined, UserOutlined, CalendarOutlined, DownloadOutlined, TableOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './AdminDashboard';
import userService from '../../../shared/services/userService';
import 'moment/locale/fr';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const TIME_SLOTS = ['8h-10h', '10h-12h', '14h-16h', '16h-18h'];

const timeSlots = [
  '07:30-08:30',
  '08:30-09:30',
  '09:30-10:30',
  '10:30-11:30',
  '11:30-12:30',
  '12:30-13:30',
  '13:30-14:30',
  '14:30-15:30',
  '15:30-16:30',
  '16:30-17:30'
];

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const UserManager = () => {
  const [usersData, setUsersData] = useState({
    students: [],
    teachers: [],
    parents: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserType, setCurrentUserType] = useState('students');
  const [form] = Form.useForm();
  const [currentView, setCurrentView] = useState('levels');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentTeacherView, setCurrentTeacherView] = useState('departments');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [isClassScheduleModalVisible, setIsClassScheduleModalVisible] = useState(false);
  const [classScheduleForm] = Form.useForm();
  const [schedules, setSchedules] = useState({
    teachers: {},  // { teacherId: { day: { timeSlot: [classes] } } }
    classes: {}    // { className: { day: { timeSlot: { subject, teacherId } } } }
  });
  const [scheduleView, setScheduleView] = useState('table'); // 'table' ou 'calendar'

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
      },
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
        title: 'Parent',
        dataIndex: 'parentEmail',
        key: 'parentEmail',
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
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
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Matières',
        dataIndex: 'subjects',
        key: 'subjects',
        render: (subjects) => (
          <>
            {subjects.map(subject => (
              <Tag key={subject}>{subject}</Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
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
              icon={<CalendarOutlined />}
              onClick={() => handleScheduleEdit(record)}
              type="primary"
              ghost
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
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Enfants',
        dataIndex: 'children',
        key: 'children',
        render: (children) => (
          <>
            {children.map(child => (
              <Tag key={child}>{child}</Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
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
          // Modification d'un utilisateur existant
          await userService.updateUser(form.getFieldValue('key'), userData);
          message.success('Utilisateur modifié avec succès');
        } else {
          // Création d'un nouvel utilisateur
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
        children: parent.children.map(child => child.name),
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

  const handleScheduleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsScheduleModalVisible(true);
    scheduleForm.setFieldsValue(loadSchedule('teacher', teacher.key));
  };

  const handleClassScheduleEdit = (className) => {
    setSelectedClass(className);
    setIsClassScheduleModalVisible(true);
    classScheduleForm.setFieldsValue(loadSchedule('class', className));
  };

  const handleTeacherScheduleSave = (values) => {
    const teacherId = selectedTeacher.key;
    setSchedules(prev => ({
      ...prev,
      teachers: {
        ...prev.teachers,
        [teacherId]: values
      }
    }));

    // Mettre à jour les emplois du temps des classes concernées
    Object.entries(values).forEach(([day, slots]) => {
      Object.entries(slots).forEach(([timeSlot, classes]) => {
        if (classes) {
          classes.forEach(classInfo => {
            const [className, subject] = classInfo.split('-');
            setSchedules(prev => ({
              ...prev,
              classes: {
                ...prev.classes,
                [className]: {
                  ...prev.classes[className],
                  [day]: {
                    ...(prev.classes[className]?.[day] || {}),
                    [timeSlot]: {
                      subject,
                      teacherId
                    }
                  }
                }
              }
            }));
          });
        }
      });
    });

    setIsScheduleModalVisible(false);
    message.success("Emploi du temps mis à jour avec succès");
  };

  const handleClassScheduleSave = (values) => {
    const className = selectedClass;
    
    // Vérifier les conflits
    const conflicts = [];
    Object.entries(values).forEach(([day, slots]) => {
      Object.entries(slots).forEach(([timeSlot, teacherSubject]) => {
        if (teacherSubject) {
          const [teacherId] = teacherSubject.split('-');
          
          // Vérifier si le professeur est déjà occupé
          const teacherSchedule = schedules.teachers[teacherId]?.[day]?.[timeSlot] || [];
          if (teacherSchedule.length > 0) {
            const otherClasses = teacherSchedule.filter(c => !c.startsWith(className));
            if (otherClasses.length > 0) {
              conflicts.push(`${day} ${timeSlot}: ${usersData.teachers.find(t => t.key === teacherId).name} est déjà occupé`);
            }
          }
        }
      });
    });

    if (conflicts.length > 0) {
      Modal.error({
        title: 'Conflits détectés',
        content: (
          <ul>
            {conflicts.map((conflict, index) => (
              <li key={index}>{conflict}</li>
            ))}
          </ul>
        )
      });
      return;
    }

    setSchedules(prev => ({
      ...prev,
      classes: {
        ...prev.classes,
        [className]: values
      }
    }));

    // Mettre à jour les emplois du temps des professeurs concernés
    Object.entries(values).forEach(([day, slots]) => {
      Object.entries(slots).forEach(([timeSlot, teacherSubject]) => {
        if (teacherSubject) {
          const [teacherId, subject] = teacherSubject.split('-');
          setSchedules(prev => ({
            ...prev,
            teachers: {
              ...prev.teachers,
              [teacherId]: {
                ...prev.teachers[teacherId],
                [day]: {
                  ...(prev.teachers[teacherId]?.[day] || {}),
                  [timeSlot]: [
                    ...(prev.teachers[teacherId]?.[day]?.[timeSlot] || []).filter(c => !c.startsWith(className)),
                    `${className}-${subject}`
                  ]
                }
              }
            }
          }));
        }
      });
    });

    setIsClassScheduleModalVisible(false);
    message.success("Emploi du temps mis à jour avec succès");
  };

  const loadSchedule = (type, id) => {
    if (type === 'teacher') {
      return schedules.teachers[id] || {};
    } else if (type === 'class') {
      return schedules.classes[id] || {};
    }
    return {};
  };

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
              <Option value="Histoire">Histoire</Option>
              <Option value="Physique">Physique</Option>
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
                <Option key={student.key} value={student.name}>{student.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ),
    };

    return formItems[currentUserType] || null;
  };

  const renderStudentContent = () => {
    const renderLevels = () => (
      <div>
        <Row gutter={[16, 16]}>
          {levels.map(level => (
            <Col xs={24} sm={12} md={8} lg={6} key={level.id}>
              <Card
                hoverable
                className="level-card"
                onClick={() => {
                  setSelectedLevel(level);
                  setCurrentView('classes');
                }}
              >
                <Statistic
                  title={level.name}
                  value={level.classes.length}
                  suffix="classes"
                />
              </Card>
            </Col>
          ))}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="add-level-card"
              onClick={() => {
                // Logique pour ajouter un niveau
                Modal.confirm({
                  title: 'Ajouter un niveau',
                  content: (
                    <Input placeholder="Nom du niveau" />
                  ),
                  onOk: () => {
                    // Logique d'ajout
                  }
                });
              }}
            >
              <div className="add-level-content">
                <PlusOutlined style={{ fontSize: 24 }} />
                <div>Ajouter un niveau</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );

    const renderClasses = () => (
      <div>
        <Row gutter={[16, 16]}>
          {selectedLevel.classes.map(className => (
            <Col xs={24} sm={12} md={8} lg={6} key={className}>
              <Card
                hoverable
                className="class-card"
              >
                <Statistic
                  title={className}
                  value={usersData.students.filter(s => s.class === className).length}
                  suffix="élèves"
                />
                <Space className="class-actions">
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedClass(className);
                      setCurrentView('students');
                    }}
                  >
                    Voir les élèves
                  </Button>
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassScheduleEdit(className);
                    }}
                    type="primary"
                    ghost
                  >
                    Emploi du temps
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="add-class-card"
              onClick={() => {
                Modal.confirm({
                  title: `Ajouter une classe en ${selectedLevel.name}`,
                  content: (
                    <Input placeholder="Nom de la classe" />
                  ),
                  onOk: () => {
                    // Logique d'ajout
                  }
                });
              }}
            >
              <div className="add-class-content">
                <PlusOutlined style={{ fontSize: 24 }} />
                <div>Ajouter une classe</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item 
            onClick={() => {
              setCurrentView('levels');
              setSelectedLevel(null);
              setSelectedClass(null);
            }}
            className="breadcrumb-link"
          >
            Niveaux
          </Breadcrumb.Item>
          {selectedLevel && (
            <Breadcrumb.Item
              onClick={() => {
                setCurrentView('classes');
                setSelectedClass(null);
              }}
              className="breadcrumb-link"
            >
              {selectedLevel.name}
            </Breadcrumb.Item>
          )}
          {selectedClass && (
            <Breadcrumb.Item>{selectedClass}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {currentView === 'levels' && renderLevels()}
        {currentView === 'classes' && renderClasses()}
        {currentView === 'students' && (
          <Table 
            columns={columns.students} 
            dataSource={usersData.students.filter(s => s.class === selectedClass)}
              loading={loading}
            className="user-table"
          />
        )}
      </div>
    );
  };

  const renderTeacherContent = () => {
    const renderDepartments = () => (
      <div>
        <Row gutter={[16, 16]}>
          {departments.map(dept => (
            <Col xs={24} sm={12} md={8} key={dept.id}>
              <Card
                hoverable
                className="department-card"
                onClick={() => {
                  setSelectedDepartment(dept);
                  setCurrentTeacherView('subjects');
                }}
                style={{ 
                  borderLeft: `4px solid ${dept.color}`,
                  height: '180px'
                }}
              >
                <Statistic
                  title={
                    <Space direction="vertical" size={4}>
                      <span style={{ fontSize: '18px', fontWeight: 600 }}>{dept.name}</span>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {dept.subjects.length} matières
                      </span>
                    </Space>
                  }
                  value={usersData.teachers.filter(t => 
                    t.subjects && t.subjects.some(s => dept.subjects.includes(s))
                  ).length}
                  suffix="professeurs"
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: `Ajouter une matière à ${dept.name}`,
                      content: (
                        <Input placeholder="Nom de la matière" />
                      ),
                      onOk: (close) => {
                        // Logique d'ajout de matière
                        close();
                      }
                    });
                  }}
                  style={{ position: 'absolute', bottom: '12px', right: '12px' }}
                >
                  Ajouter une matière
                </Button>
              </Card>
            </Col>
          ))}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="add-department-card"
              onClick={() => {
                Modal.confirm({
                  title: 'Ajouter un département',
                  content: (
                    <Form layout="vertical">
                      <Form.Item
                        label="Nom du département"
                        required
                      >
                        <Input placeholder="Ex: Sciences" />
                      </Form.Item>
                      <Form.Item
                        label="Couleur"
                        required
                      >
                        <Input type="color" style={{ width: 120 }} />
                      </Form.Item>
                    </Form>
                  ),
                  onOk: () => {
                    // Logique d'ajout de département
                  }
                });
              }}
              style={{ height: '180px' }}
            >
              <div className="add-department-content">
                <PlusOutlined style={{ fontSize: 24 }} />
                <div>Ajouter un département</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );

    const renderSubjects = () => (
      <div>
        <Row gutter={[16, 16]}>
          {selectedDepartment.subjects.map(subject => (
            <Col xs={24} sm={12} md={8} key={subject}>
              <Card
                hoverable
                className="subject-card"
                onClick={() => {
                  setCurrentTeacherView('teachers');
                  setSelectedSubject(subject);
                }}
                style={{ 
                  borderLeft: `4px solid ${selectedDepartment.color}`,
                  height: '180px'
                }}
              >
                <Statistic
                  title={
                    <Space direction="vertical" size={4}>
                      <span style={{ fontSize: '16px', fontWeight: 500 }}>{subject}</span>
                    </Space>
                  }
                  value={usersData.teachers.filter(t => 
                    t.subjects && t.subjects.includes(subject)
                  ).length}
                  suffix="professeurs"
                />
                <div className="subject-teachers">
                  {usersData.teachers
                    .filter(t => t.subjects && t.subjects.includes(subject))
                    .slice(0, 5)
                    .map(teacher => (
                      <Tag key={teacher.key}>{teacher.name}</Tag>
                    ))}
                </div>
              </Card>
            </Col>
          ))}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="add-subject-card"
              onClick={() => {
                Modal.confirm({
                  title: `Ajouter une matière dans ${selectedDepartment.name}`,
                  content: (
                    <Form layout="vertical">
                      <Form.Item
                        label="Nom de la matière"
                        required
                      >
                        <Input placeholder="Ex: Mathématiques" />
                      </Form.Item>
                    </Form>
                  ),
                  onOk: () => {
                    // Logique d'ajout de matière
                  }
                });
              }}
              style={{ height: '180px' }}
            >
              <div className="add-subject-content">
                <PlusOutlined style={{ fontSize: 24 }} />
                <div>Ajouter une matière</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item 
            onClick={() => {
              setCurrentTeacherView('departments');
              setSelectedDepartment(null);
            }}
            className="breadcrumb-link"
          >
            Départements
          </Breadcrumb.Item>
          {selectedDepartment && (
            <Breadcrumb.Item
              onClick={() => {
                setCurrentTeacherView('subjects');
              }}
              className="breadcrumb-link"
            >
              {selectedDepartment.name}
            </Breadcrumb.Item>
          )}
          {currentTeacherView === 'teachers' && (
            <Breadcrumb.Item>Professeurs</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {currentTeacherView === 'departments' && renderDepartments()}
        {currentTeacherView === 'subjects' && renderSubjects()}
        {currentTeacherView === 'teachers' && (
          <Table 
            columns={columns.teachers}
            loading={loading}
            dataSource={usersData.teachers.filter(t => 
t.subjects && t.subjects.includes(selectedSubject)
)}
            className="user-table"
          />

        )}
      </div>
    );
  };

  const levels = [
    { id: '1', name: '6ème', classes: ['6ème A', '6ème B', '6ème C'] },
    { id: '2', name: '5ème', classes: ['5ème A', '5ème B'] },
    { id: '3', name: '4ème', classes: ['4ème A', '4ème B'] },
    { id: '4', name: '3ème', classes: ['3ème A', '3ème B'] },
  ];

  const departments = [
    {
      id: '1',
      name: 'Sciences',
      subjects: ['Mathématiques', 'Physique-Chimie', 'SVT'],
      color: '#1890ff'
    },
    {
      id: '2',
      name: 'Lettres & Sciences Humaines',
      subjects: ['Français', 'Histoire-Géographie', 'Langues'],
      color: '#52c41a'
    },
    {
      id: '3',
      name: 'Arts & Sport',
      subjects: ['Arts Plastiques', 'Musique', 'EPS'],
      color: '#722ed1'
    }
  ];

  const renderScheduleContent = (type) => {
    const scheduleData = type === 'teacher' ? 
      schedules.teachers[selectedTeacher?.key] : 
      schedules.classes[selectedClass];

    if (scheduleView === 'calendar') {
      return (
        <Calendar
          locale={{
            lang: {
              locale: 'fr',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
            }
          }}
          dateCellRender={(date) => {
            const day = date.format('dddd').toLowerCase();
            if (!scheduleData?.[day]) return null;

            return (
              <ul className="schedule-events">
                {Object.entries(scheduleData[day]).map(([timeSlot, value]) => (
                  <li key={timeSlot}>
                    <Tooltip title={
                      type === 'teacher' 
                        ? `Classes: ${value.join(', ')}` 
                        : `Prof: ${usersData.teachers.find(t => t.key === value.teacherId)?.name}`
                    }>
                      <Badge 
                        status="processing" 
                        text={`${timeSlot}: ${type === 'teacher' ? value.length + ' classes' : value.subject}`} 
                      />
                    </Tooltip>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      );
    }

    return (
      <div className="schedule-container">
        <div className="schedule-grid">
          <div className="schedule-header">
            <div className="time-column"></div>
            {weekDays.map(day => (
              <div key={day} className="day-column">
                <div className="text-center">
                  <div className="font-medium">{day}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="schedule-body">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="time-row">
                <div className="time-label">
                  <Text type="secondary">{timeSlot}</Text>
                </div>
                {weekDays.map(day => (
                  <div key={`${day}-${timeSlot}`} className="schedule-cell-wrapper">
                    {type === 'teacher' ? (
                      <Form.Item
                        name={[day.toLowerCase(), timeSlot]}
                        noStyle
                      >
                        <Select
                          mode="multiple"
                          placeholder="Sélectionner classe(s)"
                          style={{ width: '100%' }}
                          options={levels.flatMap(level => 
                            level.classes.map(className => ({
                              label: `${className} - ${selectedTeacher?.subjects[0] || ''}`,
                              value: `${className}-${selectedTeacher?.subjects[0] || ''}`
                            }))
                          )}
                          dropdownMatchSelectWidth={false}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        name={[day.toLowerCase(), timeSlot]}
                        noStyle
                      >
                        <Select
                          placeholder="Sélectionner cours"
                          style={{ width: '100%' }}
                          dropdownMatchSelectWidth={false}
                        >
                          {departments.flatMap(dept =>
                            dept.subjects.map(subject => (
                              <Select.OptGroup key={`${dept.name}-${subject}`} label={subject}>
                                {usersData.teachers
                                  .filter(t => t.subjects.includes(subject))
                                  .map(teacher => (
                                    <Option 
                                      key={`${teacher.key}-${subject}`}
                                      value={`${teacher.key}-${subject}`}
                                    >
                                      {teacher.name}
                                    </Option>
                                  ))}
                              </Select.OptGroup>
                            ))
                          )}
                        </Select>
                      </Form.Item>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const exportSchedule = (type) => {
    const scheduleData = type === 'teacher' ? 
      schedules.teachers[selectedTeacher?.key] : 
      schedules.classes[selectedClass];
    
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ['Horaire', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    ];

    TIME_SLOTS.forEach(timeSlot => {
      const row = [timeSlot];
      ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].forEach(day => {
        const value = scheduleData?.[day]?.[timeSlot];
        row.push(type === 'teacher' 
          ? (value || []).join(', ')
          : value ? `${value.subject} (${usersData.teachers.find(t => t.key === value.teacherId)?.name})` : ''
        );
      });
      ws_data.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Emploi du temps");
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileName = type === 'teacher' 
      ? `EDT_${selectedTeacher.name}.xlsx`
      : `EDT_${selectedClass}.xlsx`;
    
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
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
              {renderStudentContent()}
            </TabPane>
            <TabPane tab="Enseignants" key="teachers">
              {renderTeacherContent()}
            </TabPane>
            <TabPane tab="Parents" key="parents">
              <Table 
                columns={columns.parents} 
                dataSource={usersData.parents}
                loading={loading}
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

        <Modal
          title={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <CalendarOutlined />
                <span>Emploi du temps - {selectedTeacher?.name || selectedClass}</span>
              </Space>
              <Space>
                <Button
                  icon={scheduleView === 'table' ? <CalendarOutlined /> : <TableOutlined />}
                  onClick={() => setScheduleView(prev => prev === 'table' ? 'calendar' : 'table')}
                >
                  Vue {scheduleView === 'table' ? 'calendrier' : 'tableau'}
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => exportSchedule(selectedTeacher ? 'teacher' : 'class')}
                >
                  Exporter
                </Button>
              </Space>
            </Space>
          }
          open={isScheduleModalVisible}
          onOk={() => {
            scheduleForm.validateFields().then(handleTeacherScheduleSave);
          }}
          onCancel={() => setIsScheduleModalVisible(false)}
          width={1000}
          className="schedule-modal"
        >
          {renderScheduleContent(selectedTeacher ? 'teacher' : 'class')}
        </Modal>

        <Modal
          title={
            <Space>
              <CalendarOutlined />
              <span>Emploi du temps - {selectedClass}</span>
            </Space>
          }
          open={isClassScheduleModalVisible}
          onOk={() => {
            classScheduleForm.validateFields().then(handleClassScheduleSave);
          }}
          onCancel={() => setIsClassScheduleModalVisible(false)}
          width={1000}
          className="schedule-modal"
        >
          <Form
            form={classScheduleForm}
            layout="vertical"
          >
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => (
              <Card 
                key={day} 
                title={day}
                className="schedule-day-card"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Row gutter={[16, 16]}>
                  {['8h-10h', '10h-12h', '14h-16h', '16h-18h'].map(timeSlot => (
                    <Col span={6} key={timeSlot}>
                      <Form.Item
                        name={[day.toLowerCase(), timeSlot]}
                        label={timeSlot}
                      >
                        <Select
                          placeholder="Sélectionner cours"
                          style={{ width: '100%' }}
                        >
                          {departments.flatMap(dept =>
                            dept.subjects.map(subject => (
                              <Select.OptGroup key={`${dept.name}-${subject}`} label={subject}>
                                {usersData.teachers
                                  .filter(t => t.subjects.includes(subject))
                                  .map(teacher => (
                                    <Option 
                                      key={`${teacher.key}-${subject}`}
                                      value={`${teacher.key}-${subject}`}
                                    >
                                      {teacher.name}
                                    </Option>
                                  ))}
                              </Select.OptGroup>
                            ))
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </Form>
        </Modal>

        <style className="user-manager-styles">{`
          .user-manager-container {
            padding: 24px;
          }

          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .title-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .stat-card {
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .students-stat {
            border-left: 4px solid #1890ff;
          }

          .teachers-stat {
            border-left: 4px solid #52c41a;
          }

          .parents-stat {
            border-left: 4px solid #722ed1;
          }

          .main-card {
            margin-top: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .user-tabs .ant-tabs-nav {
            margin-bottom: 16px;
          }

          .user-table {
            margin-top: 16px;
          }

          .user-table .ant-table-thead > tr > th {
            background: #fafafa;
            font-weight: 600;
          }

          .search-input {
            margin-left: 16px;
          }

          .filter-select {
            min-width: 120px;
          }

          .add-button {
            border-radius: 6px;
          }

          .user-modal .ant-modal-content {
            border-radius: 12px;
          }

          .user-form .ant-form-item {
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .user-manager-container {
              padding: 16px;
            }

            .header-section {
              flex-direction: column;
              gap: 16px;
              align-items: flex-start;
            }
          }

          .level-card, .class-card, .add-level-card, .add-class-card {
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .level-card:hover, .class-card:hover {
            transform: translateY(-4px);
          }

          .add-level-content, .add-class-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 24px;
            color: #1890ff;
          }

          .breadcrumb-link {
            cursor: pointer;
            color: #1890ff;
          }

          .breadcrumb-link:hover {
            text-decoration: underline;
          }

          .department-card, .subject-card {
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .department-card:hover, .subject-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .subject-teachers {
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .subject-teachers .ant-tag {
            margin: 0;
          }

          .department-card {
            position: relative;
            overflow: hidden;
          }

          .add-department-card {
            border: 2px dashed #d9d9d9;
            background-color: #fafafa;
            transition: all 0.3s ease;
          }

          .add-department-card:hover {
            border-color: #1890ff;
            background-color: #f0f5ff;
          }

          .add-department-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #1890ff;
          }

          .department-card .ant-statistic {
            margin-bottom: 24px;
          }

          .department-card .ant-btn-text {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .department-card:hover .ant-btn-text {
            opacity: 1;
          }

          .subject-card {
            position: relative;
            overflow: hidden;
          }

          .subject-card .subject-teachers {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
          }

          .add-subject-card {
            border: 2px dashed #d9d9d9;
            background-color: #fafafa;
            transition: all 0.3s ease;
          }

          .add-subject-card:hover {
            border-color: #1890ff;
            background-color: #f0f5ff;
          }

          .add-subject-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #1890ff;
          }

          .subject-card .ant-statistic {
            margin-bottom: 40px;
          }

          .schedule-modal .ant-modal-body {
            max-height: 70vh;
            overflow-y: auto;
          }

          .schedule-day-card {
            background-color: #fafafa;
            border-radius: 8px;
          }

          .schedule-day-card .ant-card-head {
            background-color: #f0f2f5;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }

          .schedule-day-card .ant-form-item {
            margin-bottom: 8px;
          }

          .schedule-day-card .ant-select {
            width: 100%;
          }

          .schedule-day-card .ant-form-item-label {
            padding-bottom: 4px;
          }

          .schedule-day-card .ant-form-item-label > label {
            font-size: 12px;
            color: #666;
          }

          .schedule-modal .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
            padding: 16px 24px;
          }

          .class-card {
            height: 180px;
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .class-actions {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            display: flex;
            justify-content: center;
            gap: 8px;
          }

          .class-card .ant-statistic {
            margin-bottom: 48px;
            text-align: center;
          }

          .schedule-modal .ant-select-item-group {
            font-weight: 600;
            color: #1890ff;
          }

          .schedule-modal .ant-select-item {
            padding-left: 24px;
          }

          .schedule-events {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .schedule-events li {
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
          }

          .ant-picker-calendar-full .ant-picker-panel {
            background-color: white;
            border-radius: 8px;
          }

          .ant-picker-calendar-full .ant-picker-cell {
            padding: 4px 8px;
          }

          .ant-picker-calendar-full .ant-picker-calendar-date-content {
            height: 80px;
            overflow-y: auto;
          }

          .schedule-modal .ant-modal-body {
            padding: 24px;
          }

          .schedule-modal .ant-calendar-picker {
            width: 100%;
          }

          .schedule-container {
            overflow-x: auto;
          }

          .schedule-grid {
            min-width: 800px;
          }

          .schedule-header {
            display: grid;
            grid-template-columns: 100px repeat(5, 1fr);
            border-bottom: 1px solid #f0f0f0;
            padding: 16px 0;
          }

          .schedule-body {
            position: relative;
          }

          .time-row {
            display: grid;
            grid-template-columns: 100px repeat(5, 1fr);
            min-height: 80px;
            border-bottom: 1px solid #f0f0f0;
          }

          .time-label {
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #f0f0f0;
          }

          .schedule-cell-wrapper {
            position: relative;
            border-right: 1px solid #f0f0f0;
            padding: 8px;
          }

          .day-column {
            padding: 8px;
            text-align: center;
          }

          .text-center {
            text-align: center;
          }

          .font-medium {
            font-weight: 500;
          }

          .schedule-cell-wrapper .ant-select {
            width: 100%;
          }

          .schedule-cell-wrapper .ant-form-item {
            margin-bottom: 0;
          }

          .schedule-modal .ant-modal-body {
            padding: 24px;
            max-height: 80vh;
            overflow-y: auto;
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default UserManager; 