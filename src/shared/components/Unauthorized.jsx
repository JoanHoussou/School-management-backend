import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackHome = () => {
    if (user) {
      navigate(`/${user.role}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="Accès non autorisé"
        subTitle="Désolé, vous n'avez pas les droits nécessaires pour accéder à cette page."
        extra={
          <Button type="primary" onClick={handleBackHome}>
            Retour à l'accueil
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized; 