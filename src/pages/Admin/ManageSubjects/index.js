import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalVisible(true);
  };

  const handleDeleteSubject = async (id) => {
    try {
      await fetch(`http://localhost:5000/subjects/${id}`, {
        method: 'DELETE',
      });
      api.success({ message: 'Xóa môn thi thành công!' });
      fetchSubjects();
    } catch (error) {
      api.error({ message: 'Xóa môn thi thất bại!' });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSubject) {
        // Cập nhật môn thi
        await fetch(`http://localhost:5000/subjects/${editingSubject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        api.success({ message: 'Cập nhật môn thi thành công!' });
      } else {
        // Thêm mới môn thi
        await fetch('http://localhost:5000/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        api.success({ message: 'Thêm môn thi thành công!' });
      }
      fetchSubjects();
      setIsModalVisible(false);
    } catch (error) {
      api.error({ message: 'Lưu môn thi thất bại!' });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên môn thi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá trị (value)',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => handleEditSubject(record)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa môn thi này không?'
            onConfirm={() => handleDeleteSubject(record.id)}
            okText='Có'
            cancelText='Không'
          >
            <Button type='link' danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <h1>Quản lý Môn Thi</h1>
      <Button type='primary' icon={<PlusOutlined />} onClick={handleAddSubject}>
        Thêm Môn Thi
      </Button>
      <Table
        dataSource={subjects}
        columns={columns}
        rowKey='id'
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingSubject ? 'Chỉnh sửa Môn Thi' : 'Thêm Môn Thi'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Lưu'
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='Tên môn thi'
            rules={[{ required: true, message: 'Vui lòng nhập tên môn thi!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='value'
            label='Giá trị (value)'
            rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSubjects;
