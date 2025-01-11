import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children, menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const handleLogout = async () => {
    await logout();
  };

  const userTypeLabel = {
    student: 'Élève',
    parent: 'Parent',
    teacher: 'Enseignant',
    admin: 'Administrateur'
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center justify-between px-6">
        <div className="flex items-center">
          <h1 className="text-white text-xl mr-8">Gestion Scolaire</h1>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </div>
        <div className="flex items-center text-white">
          <span className="mr-4">
            {userTypeLabel[user?.role]} : {user?.name}
          </span>
          <LogoutOutlined 
            className="text-xl cursor-pointer" 
            onClick={handleLogout}
          />
        </div>
      </Header>

      <Content className="site-layout-content m-6">
        {children}
      </Content>

      <Footer className="text-center">
        Gestion Scolaire ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  );
};

export default Layout; 