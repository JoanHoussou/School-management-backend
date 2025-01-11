import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setError('');
      setLoading(true);
      await login(values);
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[500px]">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Connexion
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Utilisez vos identifiants pour accéder à votre espace
            </p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Veuillez saisir votre identifiant' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Identifiant"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mot de passe"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Se connecter
              </Button>
            </Form.Item>

            <div className="mt-6 text-sm text-center text-gray-500">
              <p className="font-medium mb-2">Identifiants de test :</p>
              <ul className="space-y-1">
                <li>student-1 / password</li>
                <li>parent-1 / password</li>
                <li>teacher-1 / password</li>
                <li>admin-1 / password</li>
              </ul>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login; 