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
  UploadOutlined
} from '@ant-design/icons';
import AppLayout from '../../../shared/components/Layout';
import { menuItems } from './StudentDashboard';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);

  const messages = [
    {
      id: 1,
      sender: 'Prof. Martin',
      subject: 'Mathématiques',
      content: `Bonjour,

Je vous rappelle que les exercices du chapitre 3 sur les fonctions dérivées sont à rendre pour demain.

N'oubliez pas de détailler vos calculs et de justifier vos réponses.

Cordialement,
Prof. Martin`,
      date: '2024-03-18 10:30',
      avatar: 'M',
      isRead: false,
      isStarred: true,
      attachments: [
        { name: 'exercices_ch3.pdf', size: '2.4 MB' }
      ]
    },
    {
      id: 2,
      sender: 'Prof. Dubois',
      subject: 'Français - Dissertation',
      content: 'La dissertation sur le réalisme est à rendre pour vendredi. Pensez à bien structurer votre argumentation.',
      date: '2024-03-18 09:15',
      avatar: 'D',
      isRead: true,
      isStarred: false,
      attachments: []
    },
    {
      id: 3,
      sender: 'Administration',
      subject: 'Réunion parents-professeurs',
      content: 'La réunion parents-professeurs aura lieu le 25 mars. Veuillez transmettre cette information à vos parents.',
      date: '2024-03-17 14:20',
      avatar: 'A',
      isRead: true,
      isStarred: false,
      attachments: [
        { name: 'planning_reunion.pdf', size: '1.1 MB' }
      ]
    }
  ];

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
                <Avatar style={{ backgroundColor: message.isRead ? '#d9d9d9' : '#1890ff' }}>
                  {message.avatar}
                </Avatar>
              </Badge>
            }
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Text strong={!message.isRead}>{message.sender}</Text>
                  {message.attachments.length > 0 && (
                    <PaperClipOutlined style={{ color: '#8c8c8c' }} />
                  )}
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
                  {message.content.split('\n')[0]}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const handleUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Le fichier doit faire moins de 5MB!');
      return false;
    }
    setReplyAttachments(prev => [...prev, file]);
    return false; // Empêche l'upload automatique
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

              <Tabs defaultActiveKey="inbox">
                <TabPane 
                  tab={<span><InboxOutlined /> Boîte de réception</span>} 
                  key="inbox"
                >
                  <MessageList messages={messages} />
                </TabPane>
                <TabPane 
                  tab={<span><StarOutlined /> Important</span>} 
                  key="starred"
                >
                  <MessageList messages={messages.filter(m => m.isStarred)} />
                </TabPane>
              </Tabs>
            </Card>
          </div>

          {/* Panneau central - Détail du message */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            {selectedMessage ? (
              <Card className="h-full message-detail">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
                        {selectedMessage.avatar}
                      </Avatar>
                      <div>
                        <Title level={4} className="!mb-0">{selectedMessage.sender}</Title>
                        <Text type="secondary">{selectedMessage.subject}</Text>
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

                  {selectedMessage.attachments.length > 0 && (
                    <>
                      <Divider />
                      <div className="space-y-2">
                        <Text strong>Pièces jointes :</Text>
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Button 
                              icon={<PaperClipOutlined />}
                              type="default"
                              size="small"
                            >
                              {attachment.name} ({attachment.size})
                            </Button>
                          </div>
                        ))}
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

          {selectedMessage?.attachments.length > 0 && (
            <div className="border-t pt-4">
              <Text type="secondary" className="mb-2 block">
                Pièces jointes originales :
              </Text>
              {selectedMessage.attachments.map((attachment, index) => (
                <Tag key={index} icon={<PaperClipOutlined />}>
                  {attachment.name}
                </Tag>
              ))}
            </div>
          )}
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

        .upload-list-inline .ant-upload-list-item {
          float: left;
          width: 200px;
          margin-right: 8px;
        }

        .upload-list-inline [class*='-upload-list-rtl'] .ant-upload-list-item {
          float: right;
        }

        .attachment-card {
          transition: all 0.3s;
        }

        .attachment-card:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </AppLayout>
  );
};

export default Messages; 