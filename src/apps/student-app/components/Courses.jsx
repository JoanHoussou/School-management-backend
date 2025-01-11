import { Card, Row, Col, Typography, Progress, Statistic, Tabs, List, Tree, Button, Tag, Modal } from 'antd';
import { 
  ReadOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  PlayCircleOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './StudentDashboard';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Courses = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Données simulées des matières
  const subjects = [
    {
      id: 1,
      name: 'Mathématiques',
      teacher: 'Prof. Martin',
      totalChapters: 12,
      completedChapters: 4,
      objective: "Maîtriser les concepts fondamentaux de l'analyse et de l'algèbre pour préparer l'entrée en études supérieures.",
      totalSessions: 120,
      completedSessions: 45,
      assignments: {
        homework: 24,
        tests: 6,
        projects: 2
      },
      progress: 35,
      syllabus: [
        {
          title: 'Analyse',
          key: '1',
          children: [
            {
              title: 'Chapitre 1: Limites et Continuité',
              key: '1-1',
              status: 'completed',
              resources: [
                { type: 'pdf', name: 'Cours - Limites', size: '2.4 MB' },
                { type: 'video', name: 'Exercices corrigés', duration: '15:30' }
              ]
            },
            {
              title: 'Chapitre 2: Dérivation',
              key: '1-2',
              status: 'in-progress',
              resources: [
                { type: 'pdf', name: 'Cours - Dérivation', size: '3.1 MB' },
                { type: 'pdf', name: 'TD - Applications', size: '1.8 MB' }
              ]
            }
          ]
        },
        {
          title: 'Algèbre',
          key: '2',
          children: [
            {
              title: 'Chapitre 1: Matrices',
              key: '2-1',
              status: 'upcoming',
              resources: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Physique-Chimie',
      teacher: 'Prof. Dubois',
      totalChapters: 10,
      completedChapters: 3,
      objective: "Comprendre les lois fondamentales de la physique et de la chimie à travers des expériences pratiques et des études théoriques.",
      totalSessions: 90,
      completedSessions: 32,
      assignments: {
        homework: 18,
        tests: 4,
        projects: 3
      },
      progress: 30,
      syllabus: [
        {
          title: 'Physique',
          key: 'p1',
          children: [
            {
              title: 'Chapitre 1: Mécanique Newtonienne',
              key: 'p1-1',
              status: 'completed',
              resources: [
                { type: 'pdf', name: 'Cours - Lois de Newton', size: '3.2 MB' },
                { type: 'video', name: 'Démonstration pratique', duration: '20:15' },
                { type: 'pdf', name: 'TP - Mesures et calculs', size: '1.5 MB' }
              ]
            },
            {
              title: 'Chapitre 2: Énergie et Travail',
              key: 'p1-2',
              status: 'in-progress',
              resources: [
                { type: 'pdf', name: 'Cours - Énergie', size: '2.8 MB' },
                { type: 'video', name: 'Exercices commentés', duration: '18:45' }
              ]
            }
          ]
        },
        {
          title: 'Chimie',
          key: 'c1',
          children: [
            {
              title: 'Chapitre 1: Structure atomique',
              key: 'c1-1',
              status: 'completed',
              resources: [
                { type: 'pdf', name: 'Cours - Atomes', size: '2.1 MB' },
                { type: 'pdf', name: 'Exercices', size: '1.3 MB' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Sciences de la Vie et de la Terre',
      teacher: 'Prof. Lambert',
      totalChapters: 8,
      completedChapters: 2,
      objective: "Explorer les mécanismes du vivant et comprendre les enjeux environnementaux actuels à travers l'étude des écosystèmes et de la géologie.",
      totalSessions: 75,
      completedSessions: 22,
      assignments: {
        homework: 16,
        tests: 4,
        projects: 4
      },
      progress: 25,
      syllabus: [
        {
          title: 'Biologie',
          key: 'b1',
          children: [
            {
              title: 'Chapitre 1: La cellule',
              key: 'b1-1',
              status: 'completed',
              resources: [
                { type: 'pdf', name: 'Cours - Structure cellulaire', size: '4.1 MB' },
                { type: 'video', name: 'Observation microscopique', duration: '12:30' },
                { type: 'pdf', name: 'TP - Observations', size: '1.7 MB' }
              ]
            },
            {
              title: 'Chapitre 2: Génétique',
              key: 'b1-2',
              status: 'in-progress',
              resources: [
                { type: 'pdf', name: 'Cours - ADN et gènes', size: '3.5 MB' },
                { type: 'pdf', name: 'Exercices pratiques', size: '2.0 MB' }
              ]
            }
          ]
        },
        {
          title: 'Géologie',
          key: 'g1',
          children: [
            {
              title: 'Chapitre 1: Structure de la Terre',
              key: 'g1-1',
              status: 'upcoming',
              resources: [
                { type: 'pdf', name: 'Introduction', size: '1.8 MB' }
              ]
            }
          ]
        }
      ]
    }
  ];

  const SubjectCard = ({ subject }) => (
    <Card 
      hoverable
      className="h-full transition-all duration-300 hover:shadow-lg"
      onClick={() => setSelectedSubject(subject)}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Title level={3} className="!mb-0">{subject.name}</Title>
          <Tag color="blue">
            {subject.completedChapters}/{subject.totalChapters} chapitres
          </Tag>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          <UserOutlined />
          <Text>{subject.teacher}</Text>
        </div>

        <Progress 
          percent={subject.progress} 
          status="active"
          format={percent => `${percent}% complété`}
        />

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic 
              title="Devoirs" 
              value={subject.assignments.homework} 
              suffix="/ an"
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Contrôles" 
              value={subject.assignments.tests}
              suffix="/ an"
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Projets" 
              value={subject.assignments.projects}
              suffix="/ an"
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
        </Row>

        <Paragraph className="text-gray-500" ellipsis={{ rows: 2 }}>
          {subject.objective}
        </Paragraph>

        <div className="flex justify-end">
          <Button type="primary" ghost icon={<RightOutlined />}>
            Voir le contenu
          </Button>
        </div>
      </div>
    </Card>
  );

  const SubjectDetail = ({ subject }) => {
    const [selectedChapter, setSelectedChapter] = useState(null);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <Title level={2}>{subject.name}</Title>
            <div className="flex items-center space-x-4 text-gray-500">
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                {subject.teacher}
              </span>
              <span className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                {subject.completedSessions}/{subject.totalSessions} séances
              </span>
            </div>
          </div>
          <Button onClick={() => setSelectedSubject(null)}>Retour aux matières</Button>
        </div>

        <Tabs defaultActiveKey="content" type="card">
          <TabPane tab="Programme" key="content">
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <Card title="Progression" className="h-full">
                  <Progress type="circle" percent={subject.progress} />
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <Text>Chapitres complétés:</Text>
                      <Text strong>{subject.completedChapters}/{subject.totalChapters}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Séances effectuées:</Text>
                      <Text strong>{subject.completedSessions}/{subject.totalSessions}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={16}>
                <Card title="Objectifs du cours" className="h-full">
                  <Paragraph>{subject.objective}</Paragraph>
                  <div className="mt-4">
                    <Title level={5}>Évaluations prévues :</Title>
                    <Row gutter={[16, 16]} className="mt-2">
                      <Col span={8}>
                        <Card size="small">
                          <Statistic 
                            title="Devoirs" 
                            value={subject.assignments.homework}
                            prefix={<BookOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small">
                          <Statistic 
                            title="Contrôles" 
                            value={subject.assignments.tests}
                            prefix={<CheckCircleOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small">
                          <Statistic 
                            title="Projets" 
                            value={subject.assignments.projects}
                            prefix={<ProjectOutlined />}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>

            <Card title="Sommaire du cours" className="mt-6">
              <Tree
                showIcon
                defaultExpandAll
                onSelect={(_, { node }) => setSelectedChapter(node)}
                treeData={subject.syllabus.map(section => ({
                  ...section,
                  icon: <BookOutlined />,
                  children: section.children.map(chapter => ({
                    ...chapter,
                    icon: chapter.status === 'completed' ? 
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      chapter.status === 'in-progress' ?
                      <ClockCircleOutlined style={{ color: '#1890ff' }} /> :
                      <BookOutlined style={{ color: '#d9d9d9' }} />
                  }))
                }))}
              />
            </Card>
          </TabPane>
          
          <TabPane tab="Ressources" key="resources">
            <Row gutter={[24, 24]}>
              <Col span={16}>
                <Card title="Toutes les ressources" className="h-full">
                  <Tabs defaultActiveKey="all" tabPosition="left">
                    <TabPane tab="Tous les documents" key="all">
                      <List
                        dataSource={subject.syllabus.flatMap(section => 
                          section.children.flatMap(chapter => 
                            chapter.resources.map(resource => ({
                              ...resource,
                              chapter: chapter.title,
                              section: section.title
                            }))
                          )
                        )}
                        renderItem={resource => (
                          <List.Item
                            actions={[
                              <Button 
                                type="primary" 
                                icon={resource.type === 'pdf' ? <DownloadOutlined /> : <PlayCircleOutlined />}
                                ghost
                              >
                                {resource.type === 'pdf' ? 'Télécharger' : 'Regarder'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="resource-icon">
                                  {resource.type === 'pdf' ? 
                                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : 
                                    <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                  }
                                </div>
                              }
                              title={resource.name}
                              description={
                                <div className="space-y-1">
                                  <Text type="secondary">{resource.section} - {resource.chapter}</Text>
                                  <div>
                                    {resource.type === 'pdf' ? 
                                      `Taille: ${resource.size}` : 
                                      `Durée: ${resource.duration}`
                                    }
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab="Cours (PDF)" key="courses">
                      <List
                        dataSource={subject.syllabus.flatMap(section => 
                          section.children.flatMap(chapter => 
                            chapter.resources
                              .filter(resource => resource.type === 'pdf' && resource.name.toLowerCase().includes('cours'))
                              .map(resource => ({
                                ...resource,
                                chapter: chapter.title,
                                section: section.title
                              }))
                          )
                        )}
                        renderItem={resource => (
                          <List.Item
                            actions={[
                              <Button 
                                type="primary" 
                                icon={resource.type === 'pdf' ? <DownloadOutlined /> : <PlayCircleOutlined />}
                                ghost
                              >
                                {resource.type === 'pdf' ? 'Télécharger' : 'Regarder'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="resource-icon">
                                  {resource.type === 'pdf' ? 
                                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : 
                                    <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                  }
                                </div>
                              }
                              title={resource.name}
                              description={
                                <div className="space-y-1">
                                  <Text type="secondary">{resource.section} - {resource.chapter}</Text>
                                  <div>
                                    {resource.type === 'pdf' ? 
                                      `Taille: ${resource.size}` : 
                                      `Durée: ${resource.duration}`
                                    }
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab="Exercices" key="exercises">
                      <List
                        dataSource={subject.syllabus.flatMap(section => 
                          section.children.flatMap(chapter => 
                            chapter.resources
                              .filter(resource => resource.name.toLowerCase().includes('exercice') || 
                                                resource.name.toLowerCase().includes('td'))
                              .map(resource => ({
                                ...resource,
                                chapter: chapter.title,
                                section: section.title
                              }))
                          )
                        )}
                        renderItem={resource => (
                          <List.Item
                            actions={[
                              <Button 
                                type="primary" 
                                icon={resource.type === 'pdf' ? <DownloadOutlined /> : <PlayCircleOutlined />}
                                ghost
                              >
                                {resource.type === 'pdf' ? 'Télécharger' : 'Regarder'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="resource-icon">
                                  {resource.type === 'pdf' ? 
                                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : 
                                    <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                  }
                                </div>
                              }
                              title={resource.name}
                              description={
                                <div className="space-y-1">
                                  <Text type="secondary">{resource.section} - {resource.chapter}</Text>
                                  <div>
                                    {resource.type === 'pdf' ? 
                                      `Taille: ${resource.size}` : 
                                      `Durée: ${resource.duration}`
                                    }
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab="Vidéos" key="videos">
                      <List
                        dataSource={subject.syllabus.flatMap(section => 
                          section.children.flatMap(chapter => 
                            chapter.resources
                              .filter(resource => resource.type === 'video')
                              .map(resource => ({
                                ...resource,
                                chapter: chapter.title,
                                section: section.title
                              }))
                          )
                        )}
                        renderItem={resource => (
                          <List.Item
                            actions={[
                              <Button 
                                type="primary" 
                                icon={resource.type === 'pdf' ? <DownloadOutlined /> : <PlayCircleOutlined />}
                                ghost
                              >
                                {resource.type === 'pdf' ? 'Télécharger' : 'Regarder'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <div className="resource-icon">
                                  {resource.type === 'pdf' ? 
                                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : 
                                    <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                  }
                                </div>
                              }
                              title={resource.name}
                              description={
                                <div className="space-y-1">
                                  <Text type="secondary">{resource.section} - {resource.chapter}</Text>
                                  <div>
                                    {resource.type === 'pdf' ? 
                                      `Taille: ${resource.size}` : 
                                      `Durée: ${resource.duration}`
                                    }
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Statistiques des ressources" className="mb-6">
                  <Statistic
                    title="Documents disponibles"
                    value={subject.syllabus.reduce((acc, section) => 
                      acc + section.children.reduce((acc2, chapter) => 
                        acc2 + chapter.resources.length, 0
                      ), 0
                    )}
                    prefix={<BookOutlined />}
                  />
                  <div className="mt-4">
                    <Title level={5}>Répartition</Title>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text>PDF</Text>
                        <Tag color="red">
                          {subject.syllabus.reduce((acc, section) => 
                            acc + section.children.reduce((acc2, chapter) => 
                              acc2 + chapter.resources.filter(r => r.type === 'pdf').length, 0
                            ), 0
                          )}
                        </Tag>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Vidéos</Text>
                        <Tag color="blue">
                          {subject.syllabus.reduce((acc, section) => 
                            acc + section.children.reduce((acc2, chapter) => 
                              acc2 + chapter.resources.filter(r => r.type === 'video').length, 0
                            ), 0
                          )}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card 
                  title="Derniers ajouts" 
                  className="latest-additions"
                  bodyStyle={{ height: '450px', overflowY: 'auto' }}
                >
                  <List
                    size="small"
                    dataSource={subject.syllabus
                      .flatMap(section => 
                        section.children.flatMap(chapter => 
                          chapter.resources
                            .filter(resource => resource.new)
                            .map(resource => ({
                              ...resource,
                              chapter: chapter.title
                            }))
                        )
                      )
                      .slice(0, 5)}
                    renderItem={resource => (
                      <List.Item className="py-2">
                        <List.Item.Meta
                          avatar={
                            <div className="resource-icon-small">
                              {resource.type === 'pdf' ? 
                                <FilePdfOutlined style={{ color: '#ff4d4f' }} /> : 
                                <PlayCircleOutlined style={{ color: '#1890ff' }} />
                              }
                            </div>
                          }
                          title={<Text ellipsis>{resource.name}</Text>}
                          description={<Text type="secondary" ellipsis>{resource.chapter}</Text>}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Modal
          title={selectedChapter?.title}
          visible={!!selectedChapter}
          onCancel={() => setSelectedChapter(null)}
          footer={null}
          width={800}
        >
          {selectedChapter?.resources && (
            <List
              dataSource={selectedChapter.resources}
              renderItem={resource => (
                <List.Item
                  actions={[
                    <Button 
                      type="primary" 
                      icon={resource.type === 'pdf' ? <DownloadOutlined /> : <PlayCircleOutlined />}
                      ghost
                    >
                      {resource.type === 'pdf' ? 'Télécharger' : 'Regarder'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={resource.type === 'pdf' ? <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={resource.name}
                    description={resource.type === 'pdf' ? `Taille: ${resource.size}` : `Durée: ${resource.duration}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
      </div>
    );
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6 max-w-7xl mx-auto">
        {!selectedSubject ? (
          <>
            <div className="flex items-center space-x-3 mb-8">
              <ReadOutlined className="text-2xl" />
              <Title level={2} className="!mb-0">Mes matières</Title>
            </div>
            <Row gutter={[24, 24]}>
              {subjects.map(subject => (
                <Col xs={24} lg={12} xl={8} key={subject.id}>
                  <SubjectCard subject={subject} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <SubjectDetail subject={selectedSubject} />
        )}
      </div>
    </AppLayout>
  );
};

export default Courses; 