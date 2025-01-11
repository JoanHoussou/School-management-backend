import { 
  Card, 
  List, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Tooltip,
  Upload,
  Progress,
  Timeline,
  Collapse,
  message,
  DatePicker,
  Space,
  Popconfirm,
  Statistic,
  Divider,
  Empty,
  InputNumber
} from 'antd';
import { 
  BookOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

const CLASS_LEVELS = [
  { value: '6eme', label: '6ème' },
  { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' },
  { value: '3eme', label: '3ème' },
  { value: '2nde', label: 'Seconde' },
  { value: '1ere', label: 'Première' },
  { value: 'Tle', label: 'Terminale' }
];

const courseData = {
  subject: "Mathématiques",
  levels: {
    '6eme': {
      progress: 70,
      chapters: [
        {
          id: 1,
          title: "Chapitre 1: Les nombres décimaux",
          description: "Opérations sur les nombres décimaux",
          status: "completed",
          progress: 100,
          steps: [
            {
              id: 1,
              title: "Introduction aux nombres décimaux",
              date: "2024-03-15",
              duration: "2h",
              status: "completed",
              notes: "Définition et propriétés de base"
            },
            {
              id: 2,
              title: "Nombres décimaux et fractions",
              date: "2024-03-18",
              duration: "2h",
              status: "completed",
              notes: "Classification et exemples"
            }
          ],
          resources: [
            {
              id: 1,
              type: "pdf",
              title: "Cours - Les nombres décimaux",
              url: "/path/to/pdf",
              size: "2.4 MB"
            },
            {
              id: 2,
              type: "video",
              title: "Vidéo explicative - Nombres décimaux",
              url: "https://example.com/video",
              duration: "15:30"
            }
          ],
          assignments: [
            {
              id: 1,
              type: "homework",
              title: "Devoir Maison 1",
              dueDate: "2024-03-25",
              status: "active"
            }
          ]
        }
      ]
    },
    '3eme': {
      progress: 65,
      chapters: [
        {
          id: 1,
          title: "Chapitre 1: Les nombres réels",
          description: "Introduction aux nombres réels et leurs propriétés",
          status: "completed",
          progress: 100,
          steps: [
            {
              id: 1,
              title: "Introduction aux nombres réels",
              date: "2024-03-15",
              duration: "2h",
              status: "completed",
              notes: "Définition et propriétés de base"
            },
            {
              id: 2,
              title: "Nombres rationnels et irrationnels",
              date: "2024-03-18",
              duration: "2h",
              status: "completed",
              notes: "Classification et exemples"
            }
          ],
          resources: [
            {
              id: 1,
              type: "pdf",
              title: "Cours - Les nombres réels",
              url: "/path/to/pdf",
              size: "2.4 MB"
            },
            {
              id: 2,
              type: "video",
              title: "Vidéo explicative - Nombres irrationnels",
              url: "https://example.com/video",
              duration: "15:30"
            }
          ],
          assignments: [
            {
              id: 1,
              type: "homework",
              title: "Devoir Maison 1",
              dueDate: "2024-03-25",
              status: "active"
            }
          ]
        }
      ]
    },
    'Tle': {
      progress: 45,
      chapters: [
        {
          id: 1,
          title: "Chapitre 1: Continuité et dérivabilité",
          description: "Étude des fonctions continues et dérivables",
          status: "completed",
          progress: 100,
          steps: [
            {
              id: 1,
              title: "Continuité et dérivabilité",
              date: "2024-03-15",
              duration: "2h",
              status: "completed",
              notes: "Définition et propriétés de base"
            },
            {
              id: 2,
              title: "Continuité et dérivabilité",
              date: "2024-03-18",
              duration: "2h",
              status: "completed",
              notes: "Classification et exemples"
            }
          ],
          resources: [
            {
              id: 1,
              type: "pdf",
              title: "Cours - Continuité et dérivabilité",
              url: "/path/to/pdf",
              size: "2.4 MB"
            },
            {
              id: 2,
              type: "video",
              title: "Vidéo explicative - Continuité et dérivabilité",
              url: "https://example.com/video",
              duration: "15:30"
            }
          ],
          assignments: [
            {
              id: 1,
              type: "homework",
              title: "Devoir Maison 1",
              dueDate: "2024-03-25",
              status: "active"
            }
          ]
        }
      ]
    }
  }
};

const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('courseData');
    return savedData ? JSON.parse(savedData) : courseData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return courseData;
  }
};

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem('courseData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const CourseManager = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [chapterForm] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [selectedLevel, setSelectedLevel] = useState('3eme');
  const [localCourseData, setLocalCourseData] = useState(loadFromLocalStorage());
  const [newChapterId, setNewChapterId] = useState(null);

  const updateLocalCourseData = (newData) => {
    setLocalCourseData(newData);
    saveToLocalStorage(newData);
  };

  const handleAddStep = (chapterId) => {
    setModalType('step');
    if (!localCourseData.levels[selectedLevel]) {
      updateLocalCourseData({
        ...localCourseData,
        levels: {
          ...localCourseData.levels,
          [selectedLevel]: {
            progress: 0,
            chapters: []
          }
        }
      });
    }
    const chapter = localCourseData.levels[selectedLevel]?.chapters?.find(c => c.id === chapterId);
    if (chapter) {
      setSelectedChapter(chapter);
      stepForm.resetFields();
      setIsModalVisible(true);
    }
  };

  const handleEditStep = (chapterId, step) => {
    setModalType('step');
    setSelectedChapter(courseData.levels[selectedLevel].chapters.find(c => c.id === chapterId));
    stepForm.setFieldsValue(step);
    setIsModalVisible(true);
  };

  const handleStepStatusChange = (chapterId, stepId, newStatus) => {
    setLocalCourseData(prev => {
      const updatedChapters = prev.levels[selectedLevel].chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            steps: chapter.steps.map(step => 
              step.id === stepId ? { ...step, status: newStatus } : step
            )
          };
        }
        return chapter;
      });

      return {
        ...prev,
        levels: {
          ...prev.levels,
          [selectedLevel]: {
            ...prev.levels[selectedLevel],
            chapters: updatedChapters
          }
        }
      };
    });
  };

  const handleAddChapter = () => {
    setModalType('chapter');
    chapterForm.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const currentForm = modalType === 'chapter' ? chapterForm : stepForm;
    
    currentForm.validateFields().then(values => {
      if (modalType === 'chapter') {
        const newChapter = {
          id: Date.now(),
          number: values.number,
          title: values.title,
          description: values.description,
          status: values.status,
          progress: 0,
          estimatedDuration: values.estimatedDuration,
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
          objectives: values.objectives,
          prerequisites: values.prerequisites || '',
          steps: [],
          resources: [],
          assignments: []
        };

        const updatedData = {
          ...localCourseData,
          levels: {
            ...localCourseData.levels,
            [selectedLevel]: localCourseData.levels[selectedLevel] || {
              progress: 0,
              chapters: []
            }
          }
        };

        updatedData.levels[selectedLevel].chapters = [
          ...(updatedData.levels[selectedLevel].chapters || []),
          newChapter
        ];

        updateLocalCourseData(updatedData);
        message.success('Chapitre ajouté avec succès');
        setIsModalVisible(false);
        chapterForm.resetFields();

        Modal.confirm({
          title: 'Ajouter des étapes',
          content: 'Voulez-vous ajouter des étapes à ce chapitre maintenant ?',
          okText: 'Oui',
          cancelText: 'Plus tard',
          onOk() {
            setNewChapterId(newChapter.id);
            setModalType('step');
            stepForm.resetFields();
            setIsModalVisible(true);
            return Promise.resolve();
          }
        });
      } else if (modalType === 'step') {
        const newStep = {
          id: Date.now(),
          title: values.title,
          date: values.date.format('YYYY-MM-DD'),
          duration: values.duration,
          status: values.status || 'planned',
          notes: values.notes || ''
        };

        const updatedData = {
          ...localCourseData,
          levels: {
            ...localCourseData.levels,
            [selectedLevel]: {
              ...localCourseData.levels[selectedLevel],
              chapters: localCourseData.levels[selectedLevel].chapters.map(chapter => {
                if (chapter.id === (selectedChapter?.id || newChapterId)) {
                  return {
                    ...chapter,
                    steps: [...(chapter.steps || []), newStep]
                  };
                }
                return chapter;
              })
            }
          }
        };

        updateLocalCourseData(updatedData);
        message.success('Étape ajoutée avec succès');
        setIsModalVisible(false);
        stepForm.resetFields();
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
      const missingFields = info.errorFields.map(field => field.name[0]).join(', ');
      message.error(`Veuillez remplir tous les champs requis : ${missingFields}`);
    });
  };

  const handleAddResource = (chapter) => {
    // TODO: Implémenter l'ajout de ressource
    console.log('Ajouter une ressource au chapitre:', chapter);
  };

  const handleEditChapter = (chapter) => {
    setModalType('chapter');
    chapterForm.setFieldsValue(chapter);
    setSelectedChapter(chapter);
    setIsModalVisible(true);
  };

  const handleDeleteStep = (chapterId, stepId) => {
    setLocalCourseData(prev => {
      const updatedChapters = prev.levels[selectedLevel].chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            steps: chapter.steps.filter(step => step.id !== stepId)
          };
        }
        return chapter;
      });

      return {
        ...prev,
        levels: {
          ...prev.levels,
          [selectedLevel]: {
            ...prev.levels[selectedLevel],
            chapters: updatedChapters
          }
        }
      };
    });

    message.success('Étape supprimée avec succès');
  };

  const renderChapterList = (chapters) => (
    <List
      className="chapter-list"
      itemLayout="vertical"
      dataSource={chapters}
      renderItem={chapter => (
        <List.Item
          className={`chapter-item ${selectedChapter?.id === chapter.id ? 'selected' : ''}`}
          onClick={() => setSelectedChapter(chapter)}
          actions={[
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditChapter(chapter);
              }}
            >
              Modifier
            </Button>,
            <Button 
              type="link" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleAddResource(chapter);
              }}
            >
              Ajouter une ressource
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={
              <div className="chapter-status">
                {chapter.status === 'completed' ? (
                  <CheckCircleOutlined className="text-success" />
                ) : (
                  <ClockCircleOutlined className="text-warning" />
                )}
              </div>
            }
            title={
              <div className="flex items-center justify-between">
                <span>{chapter.title}</span>
                <Progress 
                  percent={chapter.progress} 
                  size="small" 
                  style={{ width: 100 }}
                />
              </div>
            }
            description={chapter.description}
          />
          
          <Collapse ghost className="resource-collapse">
            <Panel 
              header={
                <div className="flex justify-between items-center">
                  <span>Étapes du chapitre</span>
                  <Button 
                    type="link" 
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddStep(chapter.id);
                    }}
                  >
                    Ajouter une étape
                  </Button>
                </div>
              } 
              key="steps"
            >
              <Timeline>
                {(chapter.steps || []).map(step => (
                  <Timeline.Item 
                    key={step.id}
                    color={
                      step.status === 'completed' ? 'green' :
                      step.status === 'in_progress' ? 'blue' :
                      'gray'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{step.title}</Text>
                        <br />
                        <Space size="small">
                          <Tag color="default">{step.date}</Tag>
                          <Tag color="default">{step.duration}</Tag>
                        </Space>
                        {step.notes && (
                          <Paragraph type="secondary" className="mt-2">
                            {step.notes}
                          </Paragraph>
                        )}
                      </div>
                      <Space>
                        <Select
                          value={step.status}
                          onChange={(value) => handleStepStatusChange(chapter.id, step.id, value)}
                          size="small"
                          style={{ width: 120 }}
                        >
                          <Option value="planned">Prévue</Option>
                          <Option value="in_progress">En cours</Option>
                          <Option value="completed">Terminée</Option>
                        </Select>
                        <Button 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={() => handleEditStep(chapter.id, step)}
                        />
                        <Popconfirm
                          title="Supprimer cette étape ?"
                          onConfirm={() => handleDeleteStep(chapter.id, step.id)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Panel>
            
            <Panel header="Ressources" key="resources">
              <Timeline>
                {chapter.resources.map(resource => (
                  <Timeline.Item 
                    key={resource.id}
                    dot={resource.type === 'pdf' ? <FilePdfOutlined /> : <PlayCircleOutlined />}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{resource.title}</Text>
                        <br />
                        <Text type="secondary">
                          {resource.type === 'pdf' ? resource.size : resource.duration}
                        </Text>
                      </div>
                      <Space>
                        <Button type="link" icon={<LinkOutlined />}>
                          Ouvrir
                        </Button>
                        <Popconfirm
                          title="Supprimer cette ressource ?"
                          onConfirm={() => handleDeleteResource(chapter.id, resource.id)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Panel>
            
            <Panel header="Évaluations" key="assignments">
              <Timeline>
                {chapter.assignments.map(assignment => (
                  <Timeline.Item 
                    key={assignment.id}
                    dot={<CalendarOutlined />}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{assignment.title}</Text>
                        <br />
                        <Text type="secondary">
                          Date: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Text>
                      </div>
                      <Tag color={
                        assignment.status === 'active' ? 'processing' :
                        assignment.status === 'completed' ? 'success' :
                        'default'
                      }>
                        {assignment.status === 'active' ? 'En cours' :
                         assignment.status === 'completed' ? 'Terminé' :
                         'Planifié'}
                      </Tag>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Panel>
          </Collapse>
        </List.Item>
      )}
    />
  );

  // ... Ajoutez les fonctions de gestion (handleAddChapter, handleEditChapter, etc.)

  return (
    <AppLayout menuItems={menuItems}>
      <div className="course-manager-container">
        <div className="header-section">
          <div>
            <Title level={2} className="!mb-0">{localCourseData.subject}</Title>
            <Space size="large" className="mt-2">
              <Select 
                value={selectedLevel}
                onChange={setSelectedLevel}
                style={{ width: 150 }}
                className="level-select"
              >
                {CLASS_LEVELS.map(level => (
                  <Option key={level.value} value={level.value}>
                    Classe de {level.label}
                  </Option>
                ))}
              </Select>
              <Text type="secondary">
                Programme {selectedLevel === 'Tle' ? 'de' : 'des'} {
                  CLASS_LEVELS.find(l => l.value === selectedLevel)?.label
                }
              </Text>
            </Space>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              className="chapters-card"
              title={
                <div className="flex justify-between items-center">
                  <span>Chapitres</span>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddChapter}
                  >
                    Nouveau chapitre
                  </Button>
                </div>
              }
            >
              {localCourseData.levels[selectedLevel]?.chapters ? (
                renderChapterList(localCourseData.levels[selectedLevel].chapters)
              ) : (
                <Empty 
                  description="Aucun chapitre pour ce niveau"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddChapter}
                  >
                    Ajouter un chapitre
                  </Button>
                </Empty>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="course-stats-card">
              <Statistic
                title={`Progression du programme de ${CLASS_LEVELS.find(l => l.value === selectedLevel)?.label}`}
                value={localCourseData.levels[selectedLevel]?.progress || 0}
                suffix="%"
                prefix={<BookOutlined />}
              />
              <Progress 
                percent={localCourseData.levels[selectedLevel]?.progress || 0}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              
              <Divider />
              
              <div className="quick-stats">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="Chapitres"
                      value={localCourseData.levels[selectedLevel]?.chapters.length || 0}
                      prefix={<BookOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Ressources"
                      value={localCourseData.levels[selectedLevel]?.chapters.reduce((sum, chapter) => 
                        sum + chapter.resources.length, 0
                      ) || 0}
                      prefix={<FileTextOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Évaluations"
                      value={localCourseData.levels[selectedLevel]?.chapters.reduce((sum, chapter) => 
                        sum + chapter.assignments.length, 0
                      ) || 0}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal du chapitre */}
      <Modal
        title="Nouveau chapitre"
        open={isModalVisible && modalType === 'chapter'}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          chapterForm.resetFields();
        }}
        width={800}
      >
        <Form form={chapterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Titre du chapitre"
                rules={[{ required: true, message: 'Le titre est requis' }]}
              >
                <Input placeholder="Ex: Chapitre 1: Les nombres réels" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="number"
                label="Numéro du chapitre"
                rules={[{ required: true, message: 'Le numéro est requis' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'La description est requise' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Décrivez le contenu et les objectifs du chapitre..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Statut"
                rules={[{ required: true, message: 'Le statut est requis' }]}
                initialValue="planned"
              >
                <Select>
                  <Option value="planned">Prévu</Option>
                  <Option value="in_progress">En cours</Option>
                  <Option value="completed">Terminé</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedDuration"
                label="Durée estimée (en heures)"
                rules={[{ required: true, message: 'La durée estimée est requise' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Date de début prévue"
                rules={[{ required: true, message: 'La date de début est requise' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Date de fin prévue"
                rules={[{ required: true, message: 'La date de fin est requise' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="objectives"
            label="Objectifs pédagogiques"
            rules={[{ required: true, message: 'Les objectifs sont requis' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Listez les objectifs d'apprentissage de ce chapitre..."
            />
          </Form.Item>

          <Form.Item
            name="prerequisites"
            label="Prérequis"
          >
            <TextArea 
              rows={3} 
              placeholder="Listez les connaissances nécessaires pour aborder ce chapitre..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de l'étape */}
      <Modal
        title="Ajouter une étape"
        open={isModalVisible && modalType === 'step'}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          stepForm.resetFields();
        }}
        width={600}
      >
        <Form form={stepForm} layout="vertical">
          <Form.Item
            name="title"
            label="Titre de l'étape"
            rules={[{ required: true, message: 'Le titre est requis' }]}
          >
            <Input placeholder="Ex: Introduction aux nombres réels" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'La date est requise' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Durée"
                rules={[{ required: true, message: 'La durée est requise' }]}
              >
                <Input placeholder="Ex: 2h" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Statut"
            rules={[{ required: true, message: 'Le statut est requis' }]}
            initialValue="planned"
          >
            <Select>
              <Option value="planned">Prévue</Option>
              <Option value="in_progress">En cours</Option>
              <Option value="completed">Terminée</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea 
              rows={4} 
              placeholder="Ajoutez des notes ou des détails sur cette étape..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .step-timeline .ant-timeline-item {
          padding-bottom: 20px;
        }

        .step-status {
          min-width: 100px;
        }

        .step-notes {
          margin-top: 8px;
          font-size: 13px;
          color: #666;
        }

        .level-select {
          .ant-select-selector {
            border-radius: 8px !important;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default CourseManager; 