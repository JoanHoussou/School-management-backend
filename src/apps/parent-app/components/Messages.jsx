import { List, Avatar, Input, Button, Card, Typography, Badge, Tabs, Tag, Tooltip, Divider, Modal, Upload, message } from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  SearchOutlined,
  InboxOutlined,
  StarOutlined,
  DeleteOutlined,
  MailOutlined,
  PaperClipOutlined,
  FilterOutlined,
  UploadOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './ParentDashboard';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);

  // Gardez vos données de messages existantes
  const messages = {
    teachers: [
      {
        id: 1,
        sender: 'Prof. Martin',
        subject: 'Mathématiques',
        content: 'Votre fils progresse bien en mathématiques. Il montre un réel intérêt pour les nouveaux concepts abordés.',
        date: '2024-03-18 10:30',
        avatar: 'M',
        unread: true,
        role: 'Professeur principal'
      },
      {
        id: 2,
        sender: 'Prof. Dubois',
        subject: 'Français',
        content: 'Points à améliorer en dissertation. Une séance de soutien pourrait être bénéfique.',
        date: '2024-03-17 14:20',
        avatar: 'D',
        unread: false,
        role: 'Professeur de Français'
      }
    ],
    administration: [
      {
        id: 3,
        sender: 'Direction',
        subject: 'Réunion parents-professeurs',
        content: 'La réunion parents-professeurs aura lieu le 25 mars à 18h. Votre présence est importante.',
        date: '2024-03-16 09:15',
        avatar: 'A',
        unread: true,
        role: 'Administration'
      }
    ]
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

  const handleReply = () => {
    console.log('Réponse envoyée:', {
      content: replyContent,
      attachments: replyAttachments
    });
    setReplyContent('');
    setReplyAttachments([]);
    setReplyModalVisible(false);
  };

  const MessageList = ({ messages }) => (
    <List
      className="message-list"
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(message) => (
        <List.Item 
          className={`message-item ${!message.isRead ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
          onClick={() => setSelectedMessage(message)}
          actions={[
            <Tooltip title="Marquer comme important">
              <Button 
                type="text" 
                icon={<StarOutlined style={{ color: message.isStarred ? '#faad14' : undefined }} />} 
              />
            </Tooltip>,
            <Tooltip title="Supprimer">
              <Button type="text" icon={<DeleteOutlined />} />
            </Tooltip>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={!message.isRead}>
                <Avatar 
                  size={45}
                  style={{ 
                    backgroundColor: message.isRead ? '#d9d9d9' : '#1890ff',
                    color: message.isRead ? '#666' : '#fff'
                  }}
                >
                  {message.avatar}
                </Avatar>
              </Badge>
            }
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Text strong={!message.isRead}>{message.sender}</Text>
                  <Text type="secondary" className="text-sm">({message.role})</Text>
                </div>
                <Text type="secondary" className="text-sm">
                  {new Date(message.date).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </div>
            }
            description={
              <div>
                <Text strong={!message.isRead}>{message.subject}</Text>
                <br />
                <Text type="secondary" ellipsis={{ rows: 1 }}>
                  {message.content}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <AppLayout menuItems={menuItems}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MailOutlined className="text-2xl" />
          <Title level={2} className="!mb-0">Messages</Title>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Liste des messages */}
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

              <Tabs defaultActiveKey="inbox">
                <Tabs.TabPane 
                  tab={<span><InboxOutlined /> Professeurs</span>} 
                  key="teachers"
                >
                  <MessageList messages={messages.teachers} />
                </Tabs.TabPane>
                <Tabs.TabPane 
                  tab={<span><StarOutlined /> Administration</span>} 
                  key="administration"
                >
                  <MessageList messages={messages.administration} />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </div>

          {/* Détail du message */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            {selectedMessage ? (
              <Card className="h-full message-detail">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar size="large" style={{ 
                        backgroundColor: selectedMessage.unread ? '#1890ff' : '#d9d9d9',
                        color: selectedMessage.unread ? '#fff' : '#666'
                      }}>
                        {selectedMessage.avatar}
                      </Avatar>
                      <div>
                        <Title level={4} className="!mb-0">{selectedMessage.sender}</Title>
                        <Text type="secondary">{selectedMessage.role}</Text>
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
                    <div className="font-medium text-lg mb-3">{selectedMessage.subject}</div>
                    {selectedMessage.content}
                  </div>

                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <>
                      <Divider />
                      <div className="space-y-2">
                        <Text strong>Pièces jointes :</Text>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div 
                              key={index} 
                              className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <PaperClipOutlined className="mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium">{attachment.name}</div>
                                <div className="text-xs text-gray-500">{attachment.size}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={() => setReplyModalVisible(true)}
                  >
                    Répondre
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MailOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Title level={4} className="mt-4">Sélectionnez un message</Title>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de réponse */}
      <Modal
        title="Répondre au message"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReplyModalVisible(false)}>
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleReply}
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

          <TextArea
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

      {/* Ajoutez ces styles */}
      <style jsx global>{`
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

export default Messages; 