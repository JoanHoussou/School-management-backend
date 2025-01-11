import { Card, Calendar, Badge, Row, Col, Typography, Statistic, Timeline, Tag, Progress, Tooltip, Tabs, Table, Modal, Button, Dropdown, Input, Select, Space } from 'antd';
import { 
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
  DownloadOutlined, 
  FilterOutlined, 
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ShareAltOutlined,
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './ParentDashboard';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

const AttendanceRecords = () => {
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const attendanceData = {
    summary: {
      presenceRate: 95,
      totalAbsences: 3,
      totalLates: 2,
      justifiedAbsences: 2,
      unjustifiedAbsences: 1,
      trend: 'positive'
    },
    absences: [
      {
        key: '1',
        date: '2024-03-10',
        type: 'absence',
        reason: 'Maladie',
        status: 'justified',
        duration: 'Journée complète',
        classes: ['Mathématiques', 'Français', 'Histoire']
      },
      {
        key: '2',
        date: '2024-03-01',
        type: 'absence',
        reason: 'Rendez-vous médical',
        status: 'justified',
        duration: 'Matin',
        classes: ['Physique', 'Anglais']
      },
      {
        key: '3',
        date: '2024-02-15',
        type: 'late',
        reason: 'Transport',
        status: 'unjustified',
        duration: '30 minutes',
        classes: ['Mathématiques']
      }
    ]
  };

  const trimesterData = {
    1: {
      months: ['Septembre', 'Octobre', 'Novembre', 'Décembre'],
      absences: [
        {
          key: 't1-1',
          date: '2023-09-15',
          type: 'absence',
          reason: 'Maladie',
          status: 'justified',
          duration: 'Journée complète',
          classes: ['Mathématiques', 'Français', 'Histoire']
        },
        {
          key: 't1-2',
          date: '2023-10-05',
          type: 'late',
          reason: 'Retard de bus',
          status: 'justified',
          duration: '15 minutes',
          classes: ['Physique-Chimie']
        },
        {
          key: 't1-3',
          date: '2023-11-20',
          type: 'absence',
          reason: 'Rendez-vous orthodontiste',
          status: 'justified',
          duration: 'Après-midi',
          classes: ['SVT', 'Anglais', 'Sport']
        },
        {
          key: 't1-4',
          date: '2023-12-01',
          type: 'late',
          reason: 'Embouteillages',
          status: 'unjustified',
          duration: '20 minutes',
          classes: ['Mathématiques']
        }
      ]
    },
    2: {
      months: ['Janvier', 'Février', 'Mars'],
      absences: [
        {
          key: 't2-1',
          date: '2024-01-08',
          type: 'absence',
          reason: 'Maladie',
          status: 'justified',
          duration: '2 jours',
          classes: ['Toutes les matières']
        },
        {
          key: 't2-2',
          date: '2024-01-22',
          type: 'late',
          reason: 'Panne de réveil',
          status: 'unjustified',
          duration: '30 minutes',
          classes: ['Histoire-Géographie']
        },
        {
          key: 't2-3',
          date: '2024-02-15',
          type: 'absence',
          reason: 'Rendez-vous médical',
          status: 'justified',
          duration: 'Matin',
          classes: ['Français', 'Anglais']
        },
        {
          key: 't2-4',
          date: '2024-02-28',
          type: 'late',
          reason: 'Intempéries',
          status: 'justified',
          duration: '10 minutes',
          classes: ['Sciences']
        },
        {
          key: 't2-5',
          date: '2024-03-11',
          type: 'absence',
          reason: 'Événement familial',
          status: 'justified',
          duration: 'Journée',
          classes: ['Toutes les matières']
        }
      ]
    },
    3: {
      months: ['Avril', 'Mai', 'Juin'],
      absences: [
        {
          key: 't3-1',
          date: '2024-04-02',
          type: 'late',
          reason: 'Retard de transport',
          status: 'justified',
          duration: '15 minutes',
          classes: ['Mathématiques']
        },
        {
          key: 't3-2',
          date: '2024-04-15',
          type: 'absence',
          reason: 'Rendez-vous orthodontiste',
          status: 'justified',
          duration: 'Après-midi',
          classes: ['Sport', 'Arts plastiques']
        },
        {
          key: 't3-3',
          date: '2024-05-06',
          type: 'absence',
          reason: 'Non justifiée',
          status: 'unjustified',
          duration: 'Matin',
          classes: ['Histoire', 'Géographie', 'Français']
        }
      ]
    }
  };

  const moreAbsences = [
    {
      key: '4',
      date: '2024-02-10',
      type: 'absence',
      reason: 'Rendez-vous médical',
      status: 'justified',
      duration: 'Après-midi',
      classes: ['SVT', 'Anglais', 'Sport']
    },
    {
      key: '5',
      date: '2024-02-05',
      type: 'late',
      reason: 'Panne de réveil',
      status: 'unjustified',
      duration: '15 minutes',
      classes: ['Français']
    }
  ];

  trimesterData[2].absences = [...trimesterData[2].absences, ...moreAbsences];

  const handleExport = (type) => {
    console.log(`Exporting as ${type}...`);
    // Implémentez la logique d'export ici
  };

  const exportMenu = {
    items: [
      {
        key: 'excel',
        label: 'Exporter en Excel',
        icon: <FileExcelOutlined />,
        onClick: () => handleExport('excel')
      },
      {
        key: 'pdf',
        label: 'Exporter en PDF',
        icon: <FilePdfOutlined />,
        onClick: () => handleExport('pdf')
      }
    ]
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long'
      })
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'late' ? 'warning' : 'error'}>
          {type === 'late' ? 'Retard' : 'Absence'}
        </Tag>
      )
    },
    {
      title: 'Durée',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                icon: <EyeOutlined />,
                label: 'Consulter',
                onClick: () => {
                  setSelectedAbsence(record);
                  setModalVisible(true);
                }
              },
              {
                key: '2',
                icon: <ShareAltOutlined />,
                label: 'Partager',
                onClick: () => console.log('Partager', record)
              },
              {
                key: '3',
                icon: <PrinterOutlined />,
                label: 'Imprimer',
                onClick: () => console.log('Imprimer', record)
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button 
            type="text" 
            icon={<EllipsisOutlined />}
            className="action-button"
          />
        </Dropdown>
      )
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'justified': return '#52c41a';
      case 'unjustified': return '#ff4d4f';
      case 'late': return '#faad14';
      default: return '#1890ff';
    }
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="attendance-container">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-0">Suivi des absences</Title>
            <Text type="secondary">Année scolaire 2023-2024</Text>
          </div>
          <Tag color="blue" className="text-lg px-4 py-1">
            Trimestre 2
          </Tag>
        </div>

        {/* Widgets de statistiques */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-widget primary-stat">
              <Statistic
                title={<Text className="widget-label">Taux de présence</Text>}
                value={attendanceData.summary.presenceRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress 
                percent={attendanceData.summary.presenceRate}
                showInfo={false}
                strokeColor="#3f8600"
                trailColor="#f0f0f0"
                size="small"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-widget warning-stat">
              <Statistic
                title={<Text className="widget-label">Absences justifiées</Text>}
                value={attendanceData.summary.justifiedAbsences}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-widget danger-stat">
              <Statistic
                title={<Text className="widget-label">Absences non justifiées</Text>}
                value={attendanceData.summary.unjustifiedAbsences}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-widget info-stat">
              <Statistic
                title={<Text className="widget-label">Retards</Text>}
                value={attendanceData.summary.totalLates}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Calendrier et Timeline */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              bordered={false} 
              className="attendance-table-widget"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    <span>Suivi des absences par trimestre</span>
                  </div>
                  <Space>
                    <Input
                      placeholder="Rechercher..."
                      prefix={<SearchOutlined />}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 200 }}
                      className="search-input"
                    />
                    <Dropdown menu={exportMenu}>
                      <Button icon={<DownloadOutlined />}>
                        Exporter
                      </Button>
                    </Dropdown>
                  </Space>
                </div>
              }
            >
              <Tabs
                type="card"
                items={Object.entries(trimesterData).map(([trimester, data]) => ({
                  label: `${trimester}er Trimestre`,
                  key: trimester,
                  children: (
                    <Tabs
                      type="line"
                      items={data.months.map(month => ({
                        label: month,
                        key: month,
                        children: (
                          <Table
                            columns={columns}
                            dataSource={data.absences.filter(absence => {
                              const absenceDate = new Date(absence.date);
                              const monthName = absenceDate.toLocaleString('fr-FR', { month: 'long' });
                              return monthName.toLowerCase() === month.toLowerCase();
                            }).filter(absence => {
                              if (!searchText) return true;
                              return (
                                absence.reason.toLowerCase().includes(searchText.toLowerCase()) ||
                                absence.duration.toLowerCase().includes(searchText.toLowerCase()) ||
                                absence.classes.some(cls => cls.toLowerCase().includes(searchText.toLowerCase()))
                              );
                            })}
                            pagination={false}
                            className="attendance-table"
                            locale={{
                              emptyText: 'Aucune absence ce mois-ci'
                            }}
                          />
                        )
                      }))}
                    />
                  )
                }))}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              bordered={false}
              className="timeline-widget"
              title={
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-2" />
                  <span>Historique récent</span>
                </div>
              }
            >
              <Timeline
                items={attendanceData.absences.map(absence => ({
                  color: getStatusColor(absence.status),
                  children: (
                    <div className="timeline-item">
                      <div className="flex items-center justify-between mb-1">
                        <Text strong>{new Date(absence.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long'
                        })}</Text>
                        <Tag color={
                          absence.type === 'late' ? 'warning' :
                          absence.status === 'justified' ? 'success' : 'error'
                        }>
                          {absence.type === 'late' ? 'Retard' : 'Absence'}
                        </Tag>
                      </div>
                      <div className="text-sm text-gray-500">{absence.reason}</div>
                      <div className="text-xs text-gray-400 mt-1">{absence.duration}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {absence.classes.map((className, index) => (
                          <Tag key={index} className="text-xs">{className}</Tag>
                        ))}
                      </div>
                    </div>
                  )
                }))}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal de détails */}
        <Modal
          title={
            <div className="modal-header">
              <div className="modal-title">Détails de l'absence</div>
              <Tag color={selectedAbsence?.type === 'late' ? 'warning' : 'error'} className="status-tag">
                {selectedAbsence?.type === 'late' ? 'Retard' : 'Absence'}
              </Tag>
            </div>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={500}
          className="absence-modal"
        >
          {selectedAbsence && (
            <div className="modal-content">
              <div className="info-section">
                <div className="date-block">
                  <CalendarOutlined className="info-icon" />
                  <div>
                    <div className="info-label">Date</div>
                    <div className="info-value">
                      {new Date(selectedAbsence.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="duration-block">
                  <ClockCircleOutlined className="info-icon" />
                  <div>
                    <div className="info-label">Durée</div>
                    <div className="info-value">{selectedAbsence.duration}</div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="details-section">
                <div className="reason-block">
                  <div className="info-label">Motif</div>
                  <div className="reason-content">
                    <div className="info-value">{selectedAbsence.reason}</div>
                    <Tag 
                      color={selectedAbsence.status === 'justified' ? 'success' : 'error'}
                      className="status-badge"
                    >
                      {selectedAbsence.status === 'justified' ? 'Justifiée' : 'Non justifiée'}
                    </Tag>
                  </div>
                </div>

                <div className="classes-block">
                  <div className="info-label">Cours manqués</div>
                  <div className="classes-grid">
                    {selectedAbsence.classes.map((cls, index) => (
                      <Tag key={index} className="class-tag">
                        {cls}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <style jsx global>{`
        .attendance-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .stat-widget {
          border-radius: 12px;
          height: 100%;
          transition: all 0.3s;
        }

        .stat-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .widget-label {
          color: #8c8c8c;
          font-size: 14px;
        }

        .calendar-widget, .timeline-widget {
          border-radius: 12px;
          height: 100%;
        }

        .timeline-widget {
          background: linear-gradient(to bottom, #fafafa, #ffffff);
        }

        .timeline-item {
          padding: 4px 0;
        }

        .absence-badge {
          font-size: 11px;
        }

        .attendance-calendar {
          background: white;
          border-radius: 8px;
          padding: 16px;
        }

        .ant-picker-calendar-date-content {
          height: 20px !important;
        }

        @media (max-width: 768px) {
          .attendance-container {
            padding: 16px;
          }
        }

        .attendance-table-widget {
          border-radius: 12px;
        }

        .attendance-table-widget .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
          border-radius: 8px 8px 0 0;
          margin: 0 4px 0 0;
        }

        .attendance-table-widget .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
          background-color: #1890ff;
          border-color: #1890ff;
        }

        .attendance-table-widget .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white;
        }

        .attendance-table {
          margin-top: 16px;
        }

        .attendance-table .ant-table-cell {
          padding: 8px 16px;
        }

        .attendance-table-widget, .timeline-widget {
          height: 100%;
        }

        .ant-modal-content {
          border-radius: 12px;
        }

        .ant-modal-header {
          border-radius: 12px 12px 0 0;
        }

        .search-input {
          border-radius: 6px;
        }

        .filter-select {
          min-width: 120px;
        }

        .export-button {
          border-radius: 6px;
        }

        .stat-widget .ant-statistic-title {
          font-size: 14px;
          color: #8c8c8c;
        }

        .stat-widget .ant-statistic-content {
          font-size: 20px;
        }

        .action-button {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:hover {
          background-color: #f5f5f5;
          border-radius: 4px;
        }

        .ant-dropdown-menu {
          padding: 4px;
          border-radius: 8px;
        }

        .ant-dropdown-menu-item {
          padding: 8px 12px;
          border-radius: 4px;
        }

        .ant-dropdown-menu-item:hover {
          background-color: #f5f5f5;
        }

        .ant-dropdown-menu-item .anticon {
          font-size: 16px;
        }

        .absence-modal .ant-modal-content {
          padding: 0;
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f1f1f;
        }

        .modal-content {
          padding: 24px;
        }

        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .date-block, .duration-block {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-icon {
          font-size: 20px;
          color: #1890ff;
          margin-top: 4px;
        }

        .info-label {
          font-size: 12px;
          color: #8c8c8c;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 15px;
          color: #262626;
          font-weight: 500;
        }

        .divider {
          height: 1px;
          background: #f0f0f0;
          margin: 20px -24px;
        }

        .details-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .reason-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 4px;
        }

        .status-badge {
          font-size: 12px;
          padding: 2px 12px;
          border-radius: 4px;
        }

        .classes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .class-tag {
          padding: 4px 12px;
          border-radius: 4px;
          background: #f5f5f5;
          border: none;
          color: #595959;
          font-size: 13px;
          transition: all 0.3s;
        }

        .class-tag:hover {
          background: #e6f7ff;
          color: #1890ff;
        }

        .status-tag {
          font-size: 13px;
          padding: 2px 12px;
          border-radius: 4px;
        }
      `}</style>
    </AppLayout>
  );
};

export default AttendanceRecords; 