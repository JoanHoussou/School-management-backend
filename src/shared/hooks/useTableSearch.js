import { useState, useEffect } from 'react';

const useTableSearch = (data, searchFields) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value) => {
    const searchLower = value.toLowerCase();
    setSearchText(value);

    if (!value) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], item);
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(val => 
            String(val).toLowerCase().includes(searchLower)
          );
        }
        return String(fieldValue || '').toLowerCase().includes(searchLower);
      })
    );

    setFilteredData(filtered);
  };

  return {
    searchText,
    filteredData,
    handleSearch
  };
};

export default useTableSearch; 