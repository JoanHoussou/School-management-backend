import { Card, Typography, Badge, Select, Button, Tooltip, Tag } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './StudentDashboard';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Heures de cours
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

  // Jours de la semaine
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  // Données de l'emploi du temps
  const scheduleData = {
    'Lundi': {
      '08:30-09:30': {
        subject: 'Mathématiques',
        teacher: 'Prof. Martin',
        room: 'Salle 201',
        type: 'Cours',
        color: '#1890ff'
      },
      '09:30-10:30': {
        subject: 'Mathématiques',
        teacher: 'Prof. Martin',
        room: 'Salle 201',
        type: 'TD',
        color: '#1890ff'
      },
      '13:30-15:30': {
        subject: 'Physique-Chimie',
        teacher: 'Prof. Dubois',
        room: 'Labo 102',
        type: 'TP',
        color: '#52c41a',
        duration: 2
      }
    },
    'Mardi': {
      '10:30-12:30': {
        subject: 'Français',
        teacher: 'Prof. Bernard',
        room: 'Salle 305',
        type: 'Cours',
        color: '#722ed1',
        duration: 2
      },
      '14:30-16:30': {
        subject: 'SVT',
        teacher: 'Prof. Lambert',
        room: 'Labo 201',
        type: 'TP',
        color: '#eb2f96',
        duration: 2
      }
    }
    // Ajoutez d'autres jours...
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

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getCellContent = (day, timeSlot) => {
    const lesson = scheduleData[day]?.[timeSlot];
    if (!lesson) return null;

    return (
      <div 
        className="schedule-cell"
        style={{
          backgroundColor: `${lesson.color}15`,
          borderLeft: `3px solid ${lesson.color}`,
          height: lesson.duration ? `${lesson.duration * 100}%` : '100%'
        }}
      >
        <div className="p-2 h-full">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{lesson.subject}</span>
            <Tag color={lesson.color} className="ml-1" style={{ margin: 0 }}>
              {lesson.type}
            </Tag>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center text-gray-500">
              <EnvironmentOutlined className="mr-1" />
              {lesson.room}
            </div>
            <div className="text-gray-500">{lesson.teacher}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
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
          </div>
        </div>

        <Card bordered={false} className="schedule-card">
          <div className="schedule-grid">
            {/* En-tête avec les jours */}
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

            {/* Grille des horaires */}
            <div className="schedule-body">
              {timeSlots.map(timeSlot => (
                <div key={timeSlot} className="time-row">
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
        </Card>
      </div>

      <style jsx global>{`
        .schedule-card {
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
          padding: 2px;
        }

        .schedule-cell {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .schedule-cell:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1;
        }

        .day-column {
          padding: 8px;
        }
      `}</style>
    </AppLayout>
  );
};

export default Schedule; 