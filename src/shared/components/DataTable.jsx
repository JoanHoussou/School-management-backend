import { Table } from 'antd';
import PropTypes from 'prop-types';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  rowKey = '_id',
  pagination = { pageSize: 10 },
  className = ''
}) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={rowKey}
      pagination={pagination}
      className={`data-table ${className}`}
    />
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  rowKey: PropTypes.string,
  pagination: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  className: PropTypes.string
};

export default DataTable; 