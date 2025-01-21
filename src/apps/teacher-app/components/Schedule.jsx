import { Card, Typography, Select, Button, Modal, Form, TimePicker, Input, message, Spin, Popconfirm } from 'antd';
import { 
  CalendarOutlined, 
  LeftOutlined,
  RightOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';
import scheduleService from '../../../shared/services/scheduleService';
import { useAuth } from '../../../shared/utils/AuthContext';
import academicService from '../../../shared/services/academicService';
import classService from '../../../shared/services/classService';
import { useState, useEffect } from 'react';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const Schedule = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [scheduleData, setScheduleData] = useState({});

  // Créer des créneaux horaires d'une heure
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8; // Commence à 8h
    return `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
  });

  const getTimeSlotStyle = (day, timeSlot) => {
    const now = new Date();
    const [currentHour] = timeSlot.split('-')[0].split(':').map(Number);
    const currentDay = weekDays[now.getDay() - 1];
    const isCurrentHour = now.getHours() === currentHour && 
                         currentDay === day;
    const isPastHour = now.getHours() > currentHour && currentDay === day ||
                      weekDays.indexOf(day) < weekDays.indexOf(currentDay);

    return isCurrentHour ? { border: '2px solid #1890ff', background: '#e6f7ff' } :
           isPastHour ? { opacity: 0.5 } : {};
  };

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [subjectsData, classesData] = await Promise.all([
        academicService.getAllSubjects(),
        classService.getAllClasses()
      ]);
      setSubjects(subjectsData.map(s => ({ _id: s._id, name: s.name })));
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Erreur lors du chargement des données initiales');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      if (!user?._id) {
        throw new Error('User ID not available');
      }

      setLoading(true);
      const data = await scheduleService.getTeacherSchedule(user._id);
      setScheduleData(organizeScheduleData(data));
    } catch (error) {
      console.error('Error fetching schedule:', error);
      message.error('Erreur lors du chargement de l\'emploi du temps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadInitialData();
      fetchSchedule();
    }
  }, []);

  const organizeScheduleData = (data) => {
    const organized = {};
    data.forEach(slot => {
      if (!organized[slot.dayOfWeek]) {
        organized[slot.dayOfWeek] = {};
      }
      organized[slot.dayOfWeek][`${slot.startTime}-${slot.endTime}`] = {
        subject: slot.subject,
        class: slot.class,
        room: slot.room,
        color: getSubjectColor(slot.subject),
        _id: slot._id
      };
    });
    return organized;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathématiques': '#1890ff',
      'Français': '#52c41a',
      'Histoire': '#722ed1',
      'Physique': '#eb2f96'
    };
    return colors[subject] || '#1890ff';
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await scheduleService.deleteSchedule(id);
      message.success('Cours supprimé avec succès');
      fetchSchedule();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Erreur lors de la suppression du cours');
    } finally {
      setSubmitting(false);
    }
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    return weekDays.map((_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  };

  const handleModalOk = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      const [startTime, endTime] = values.time.map(t => t.format('HH:mm'));
      const scheduleData = {
        subject: values.subject,
        class: values.class,
        dayOfWeek: values.day,
        startTime,
        endTime,
        room: values.room
      };

      if (selectedSlot) {
        await scheduleService.updateSchedule(selectedSlot._id, scheduleData);
      } else {
        await scheduleService.createSchedule(scheduleData);
      }

      message.success(`Cours ${selectedSlot ? 'modifié' : 'ajouté'} avec succès`);
      setIsModalVisible(false);
      form.resetFields();
      fetchSchedule();
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const handleAddClick = () => {
    form.resetFields();
    setSelectedSlot(null);
    setIsModalVisible(true);
  };

  const getCellContent = (day, timeSlot) => {
    const lesson = scheduleData[day]?.[timeSlot];
    const baseClass = "empty-cell transition-all duration-200 hover:shadow-lg rounded-md flex items-center justify-center text-xs text-gray-400";
    
    return lesson ? (
      <div
        className="schedule-cell"
        style={{
          backgroundColor: `${lesson.color}15`,
          borderLeft: `3px solid ${lesson.color}`
,
          ...getTimeSlotStyle(day, timeSlot)
        }}
      >
        <div className="p-2 h-full relative">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-10"
          ></div>
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{lesson.subject}</span>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce cours ?"
              onConfirm={() => handleDelete(lesson._id)}
              okText="Oui"
              cancelText="Non"
              disabled={submitting}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center text-gray-500">
              <TeamOutlined className="mr-1" />
              {lesson.class}
            </div>
            <div className="flex items-center text-gray-500">
              <EnvironmentOutlined className="mr-1" />
              {lesson.room}
            </div>
          </div>
          <div 
            className="edit-overlay"
            onClick={() => {
              setSelectedSlot(lesson);
              form.setFieldsValue({
                subject: lesson.subject,
                class: lesson.class,
                day: day,
                room: lesson.room,
                time: [
                  moment(timeSlot.split('-')[0], 'HH:mm'),
                  moment(timeSlot.split('-')[1], 'HH:mm')
                ]
              });
              setIsModalVisible(true);
            }}
          />
        </div>
        </div>
      </div> 
    ) : (
      <div
        className={`${baseClass} cursor-pointer`}
        style={{
          ...getTimeSlotStyle(day, timeSlot),
          borderWidth: '1px',
          borderStyle: 'dashed'
        }}
        onClick={() => {
          setSelectedSlot(null);
          form.setFieldsValue({
            day,
            time: [moment(timeSlot.split('-')[0], 'HH:mm'), moment(timeSlot.split('-')[1], 'HH:mm')]
          });
          setIsModalVisible(true);
        }}
      ></div>
    );
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
        <Spin spinning={loadingData}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CalendarOutlined className="text-2xl" />
              <Title level={2} className="!mb-0">Emploi du temps</Title>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                icon={<LeftOutlined />} 
                onClick={() => navigateWeek('prev')}
              />
              <Select defaultValue="week" style={{ width: 120 }}>
                <Option value="week">Semaine</Option>
                <Option value="day">Jour</Option>
              </Select>
              <Button 
                icon={<RightOutlined />} 
                onClick={() => navigateWeek('next')}
              />
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClick}
              >
                Ajouter un cours
              </Button>
            </div>
          </div>

          <Card bordered={false} className="schedule-card shadow-md">
            <Spin spinning={loading} tip="Chargement de l'emploi du temps...">
              <div className="schedule-grid">
                <div className="schedule-header">
                  <div className="time-column"></div>
                  {weekDays.map((day, index) => (
                    <div key={day} className="day-column">
                      <div className="text-center">
                        <div className="font-medium">{day}</div>
                        <div className="text-sm text-gray-500">
                          {weekDates[index].toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="schedule-body">
                  {timeSlots.map(timeSlot => (
                    <div key={timeSlot} className="time-row hover:bg-gray-50">
                      <div className="time-label">
                        <Text type="secondary">{timeSlot}</Text>
                      </div>
                      {weekDays.map(day => (
                        <div key={`${day}-${timeSlot}`} className="schedule-cell-wrapper">
                          {getCellContent(day, timeSlot)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Spin>
          </Card>

          <Modal
            title={selectedSlot ? "Modifier un cours" : "Ajouter un cours"}
            open={isModalVisible}
            onOk={handleModalOk}
            confirmLoading={submitting}
            onCancel={() => setIsModalVisible(false)}
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="subject"
                label="Matière"
                rules={[{ required: true, message: 'Veuillez sélectionner une matière' }]}
              >
                <Select>
                  {subjects.map(subject => (
                    <Option key={subject._id} value={subject.name}>{subject.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="class"
                label="Classe"
                rules={[{ required: true, message: 'Veuillez sélectionner une classe' }]}
              >
                <Select>
                  {classes.map(cls => (
                    <Option key={cls._id} value={cls.name}>{cls.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="day"
                label="Jour"
                rules={[{ required: true, message: 'Veuillez sélectionner un jour' }]}
              >
                <Select>
                  {weekDays.map(day => (
                    <Option key={day} value={day}>{day}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="time"
                label="Horaire"
                rules={[{ required: true, message: 'Veuillez sélectionner un horaire' }]}
              >
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>

              <Form.Item
                name="room"
                label="Salle"
                rules={[{ required: true, message: 'Veuillez indiquer une salle' }]}
              >
                <Input placeholder="Ex: Salle 201" />
              </Form.Item>
            </Form>
          </Modal>
        </Spin>
      </div>

      <style>{`
        .schedule-card {
          overflow-x: auto;
          background: linear-gradient(to bottom, #ffffff, #f9fafb);
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
          height: 50px;
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
          padding: 4px;
          transition: all 0.2s ease;
        }

        .schedule-cell-wrapper:hover {
          background-color: rgba(24, 144, 255, 0.05);
        }

        .schedule-cell {
          height: 100%
;
          width: calc(100% - 2px);
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.3s;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .empty-cell {
          height: 100%;
          width: 100%;
          border-color: #e0e0e0;
          transition: all 0.3s ease;
          padding: 2px;
          background-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: relative;
        }

        .empty-cell::after {
          content: '+';
          font-size: 14px;
          opacity: 0;
        }

        .schedule-cell:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
        }

        .empty-cell:hover {
          border-color: #1890ff;
          background-color: rgba(24, 144, 255, 0.05);
        }

        .empty-cell:hover::after {
          opacity: 1;
        }

        .day-column {
          padding: 8px;
        }

        .edit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: pointer;
          z-index: 2;
        }

        .time-label::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          width: 6px;
          height: 1px;
          background-color: #f0f0f0;
        }

        .ant-modal-content {
          border-radius: 8px;
        }
      `}</style>
    </AppLayout>
  );
};

export default Schedule;