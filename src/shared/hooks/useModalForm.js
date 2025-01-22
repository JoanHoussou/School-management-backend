import { useState } from 'react';
import { Form, message } from 'antd';

const useModalForm = (options = {}) => {
  const {
    onSubmit,
    onSuccess,
    successMessage = 'Opération réussie',
    form: existingForm
  } = options;

  const [form] = Form.useForm(existingForm);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const showModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    form.resetFields();
    setEditingRecord(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      await onSubmit(values, editingRecord);
      message.success(successMessage);
      hideModal();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      message.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    visible,
    loading,
    editingRecord,
    showModal,
    hideModal,
    handleSubmit
  };
};

export default useModalForm; 