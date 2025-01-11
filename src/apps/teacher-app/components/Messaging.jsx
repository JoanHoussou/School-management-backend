import { 
  Card, 
  List, 
  Avatar, 
  Input, 
  Button, 
  Tabs, 
  Badge, 
  Select, 
  Modal, 
  Form,
  Tag,
  Tooltip,
  Divider,
  Typography,
  Row,
  Col,
  Upload
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  MailOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  PaperClipOutlined,
  BellOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './TeacherDashboard';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const Messaging = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messages, setMessages] = useState({
    students: [
      {
        id: 1,
        sender: 'Thomas Dubois',
        class: '3ème A',
        subject: 'Question sur le devoir',
        content: 'Je ne comprends pas l\'exercice 3...',
        date: '2024-03-18 10:30',
        unread: true
      },
      {
        id: 2,
        sender: 'Marie Martin',
        class: '3ème A',
        subject: 'Absence prévue',
        content: 'Je serai absente demain pour raison médicale.',
        date: '2024-03-18 09:15',
        unread: false
      }
    ],
    parents: [
      {
        id: 3,
        sender: 'Parent de Thomas D.',
        class: '3ème A',
        subject: 'Rendez-vous',
        content: 'Pourrions-nous avoir un rendez-vous ?',
        date: '2024-03-17 14:20',
        unread: true
      }
    ]
  });

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);

  const classes = [
    { id: 1, name: '3ème A' },
    { id: 2, name: '4ème B' },
    { id: 3, name: '3ème C' }
  ];

  const recipients = {
    '3ème A': [
      { id: 1, name: 'Thomas Dubois', type: 'student' },
      { id: 2, name: 'Marie Martin', type: 'student' },
      { id: 3, name: 'Parent de Thomas D.', type: 'parent' }
    ],
    '4ème B': [
      { id: 4, name: 'Lucas Bernard', type: 'student' },
      { id: 5, name: 'Parent de Lucas B.', type: 'parent' }
    ]
  };

  const renderMessageList = (messageList) => (
    <List
      className="message-list"
      itemLayout="horizontal"
      dataSource={messageList}
      renderItem={(item) => (
        <List.Item 
          className={`message-item ${item.unread ? 'unread' : ''} ${selectedMessage?.id === item.id ? 'selected' : ''}`}
          onClick={() => setSelectedMessage(item)}
          actions={[
            <Button type="link" onClick={(e) => {
              e.stopPropagation();
              handleReply(item);
            }}>
              Répondre
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={item.unread}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {item.sender[0]}
                </Avatar>
              </Badge>
            }
            title={
              <div className="flex justify-between">
                <span>{`${item.sender} (${item.class}) - ${item.subject}`}</span>
                <small className="text-gray-500">{item.date}</small>
              </div>
            }
            description={item.content}
          />
        </List.Item>
      )}
    />
  );

  const handleNewMessage = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleReply = (message) => {
    setReplyContent('');
    setReplyAttachments([]);
    
    if (message) {
      form.setFieldsValue({
        class: message.class,
        recipient: message.sender,
        subject: `Re: ${message.subject}`
      });
    }
    
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // Logique d'envoi du message
      setIsModalVisible(false);
    });
  };

  const handleUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Le fichier doit faire moins de 5MB!');
      return false;
    }
    setReplyAttachments(prev => [...prev, file]);
    return false;
  };

  const handleRemoveAttachment = (file) => {
    setReplyAttachments(prev => prev.filter(f => f.uid !== file.uid));
  };

  const handleSendReply = () => {
    console.log('Réponse envoyée:', {
      content: replyContent,
      attachments: replyAttachments
    });
    setReplyContent('');
    setReplyAttachments([]);
    setIsModalVisible(false);
  };

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MailOutlined className="text-2xl" />
          <Title level={2} className="!mb-0">Messages</Title>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Panneau de gauche - Liste des messages */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <Card className="h-full">
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Rechercher un message..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-64"
                />
                <Tooltip title="Filtres">
                  <Button icon={<FilterOutlined />} />
                </Tooltip>
              </div>

              <Tabs defaultActiveKey="students">
                <TabPane 
                  tab={
                    <span>
                      <TeamOutlined /> Messages élèves
                      <Badge 
                        count={messages.students.filter(m => m.unread).length} 
                        style={{ marginLeft: 8 }}
                      />
                    </span>
                  } 
                  key="students"
                >
                  {renderMessageList(messages.students)}
                </TabPane>
                <TabPane 
                  tab={
                    <span>
                      <UserOutlined /> Messages parents
                      <Badge 
                        count={messages.parents.filter(m => m.unread).length}
                        style={{ marginLeft: 8 }}
                      />
                    </span>
                  } 
                  key="parents"
                >
                  {renderMessageList(messages.parents)}
                </TabPane>
              </Tabs>
            </Card>
          </div>

          {/* Panneau central - Détail du message */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <Card className="h-full message-detail">
              {selectedMessage ? (
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
                        {selectedMessage.sender[0]}
                      </Avatar>
                      <div>
                        <Title level={4} className="!mb-0">
                          {selectedMessage.sender}
                        </Title>
                        <Text type="secondary">
                          {selectedMessage.class} - {selectedMessage.subject}
                        </Text>
                      </div>
                    </div>
                    <Text type="secondary">
                      {new Date(selectedMessage.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </div>

                  <Divider />

                  <div className="message-content whitespace-pre-wrap mb-6">
                    {selectedMessage.content}
                  </div>

                  <div className="mt-6">
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />}
                      onClick={() => handleReply(selectedMessage)}
                    >
                      Répondre
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MailOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Title level={4} className="mt-4">Sélectionnez un message</Title>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de nouveau message */}
      <Modal
        title="Répondre au message"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleSendReply}
            disabled={!replyContent.trim()}
          >
            Envoyer
          </Button>
        ]}
        width={800}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Text strong>Message original</Text>
              <Text type="secondary">
                De: {selectedMessage?.sender}
              </Text>
            </div>
            <div className="text-gray-500">
              <div className="font-medium mb-1">{selectedMessage?.subject}</div>
              <div className="text-sm">
                {selectedMessage?.content.split('\n')[0]}...
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <Text strong>À: </Text>
              <Tag color="blue">{selectedMessage?.sender}</Tag>
            </div>
            <div className="mb-2">
              <Text strong>Sujet: </Text>
              <Text type="secondary">Re: {selectedMessage?.subject}</Text>
            </div>
          </div>

          <Input.TextArea
            rows={10}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrivez votre réponse ici..."
            className="reply-textarea"
          />

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Text strong>Pièces jointes :</Text>
              <Upload
                beforeUpload={handleUpload}
                fileList={replyAttachments}
                onRemove={handleRemoveAttachment}
                multiple
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>
                  Ajouter un fichier
                </Button>
              </Upload>
            </div>

            <div className="space-y-2">
              {replyAttachments.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {replyAttachments.map((file) => (
                    <div 
                      key={file.uid} 
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <PaperClipOutlined className="text-gray-400" />
                        <div className="truncate">
                          <div className="font-medium truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => handleRemoveAttachment(file)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">
                  Aucune pièce jointe
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .message-list .ant-list-item {
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .message-list .message-item:hover {
          background-color: #f5f5f5;
        }

        .message-list .message-item.selected {
          background-color: #e6f7ff;
        }

        .message-list .message-item.unread {
          background-color: #f0f5ff;
        }

        .message-detail {
          min-height: 600px;
        }

        .message-content {
          font-size: 16px;
          line-height: 1.6;
        }

        .reply-textarea {
          font-size: 14px;
          resize: none;
          border-radius: 8px;
        }

        .reply-textarea:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      `}</style>
    </AppLayout>
  );
};

export default Messaging; 