import { Card, Statistic, Space } from 'antd';
import PropTypes from 'prop-types';

const StatCard = ({ 
  icon, 
  title, 
  value, 
  suffix, 
  type = 'default',
  className = '' 
}) => {
  return (
    <Card 
      className={`stat-card card-bordered-left card-${type} ${className}`}
    >
      <Statistic
        title={<Space>{icon} {title}</Space>}
        value={value}
        suffix={suffix}
      />
    </Card>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  suffix: PropTypes.node,
  type: PropTypes.oneOf(['students', 'teachers', 'parents', 'default']),
  className: PropTypes.string
};

export default StatCard; 