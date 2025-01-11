import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingScreen = ({ tip = 'Chargement...' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spin indicator={antIcon} tip={tip} size="large">
        <div className="p-12" />
      </Spin>
    </div>
  );
};

export default LoadingScreen; 