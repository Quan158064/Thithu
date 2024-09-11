import React, { useState } from 'react';
import { Input, Button, message, Form } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id; // ID người dùng hiện tại

    // Sử dụng useFormik để quản lý form và validate
    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string()
                .required('Vui lòng nhập mật khẩu hiện tại'),
            newPassword: Yup.string()
                .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
                .required('Vui lòng nhập mật khẩu mới'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
                .required('Vui lòng xác nhận mật khẩu mới'),
        }),
        onSubmit: async (values) => {
            try {
                // Lấy thông tin người dùng hiện tại để kiểm tra mật khẩu
                const response = await fetch(`http://localhost:5000/users/${userId}`);
                const userData = await response.json();

                // So sánh mật khẩu hiện tại với mật khẩu trong cơ sở dữ liệu
                if (userData.password !== values.currentPassword) {
                    message.error('Mật khẩu hiện tại không đúng!');
                    return;
                }

                // Nếu mật khẩu hiện tại đúng, cập nhật mật khẩu mới
                const updateResponse = await fetch(`http://localhost:5000/users/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: values.newPassword,
                    }),
                });

                if (updateResponse.ok) {
                    message.success('Thay đổi mật khẩu thành công!');
                    setTimeout(() => {
                        window.location.reload(); // Reload lại trang sau 1 giây để đảm bảo người dùng thấy thông báo
                    }, 1000);
                } else {
                    message.error('Thay đổi mật khẩu thất bại.');
                }
            } catch (error) {
                console.error('Lỗi khi thay đổi mật khẩu:', error);
                message.error('Có lỗi xảy ra khi thay đổi mật khẩu.');
            }
        },
    });

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>Thay đổi mật khẩu</h1>
            <Form onFinish={formik.handleSubmit}>
                <Form.Item
                    label="Mật khẩu hiện tại"
                    help={formik.touched.currentPassword && formik.errors.currentPassword}
                    validateStatus={formik.touched.currentPassword && formik.errors.currentPassword ? 'error' : ''}
                >
                    <Input.Password
                        name="currentPassword"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    help={formik.touched.newPassword && formik.errors.newPassword}
                    validateStatus={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
                >
                    <Input.Password
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    help={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    validateStatus={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                >
                    <Input.Password
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Profile;
