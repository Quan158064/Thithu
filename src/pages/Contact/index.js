import { Button, Card, Divider, Form, Input, notification } from 'antd';
import React from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			// Gửi feedback tới server
			await fetch('http://localhost:5000/feedback', {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Gửi email cảm ơn sử dụng emailjs
			await emailjs.send(
				'service_fsu3far',
				'template_c0oiy6h',
				{
					name: values.name,
					email: values.email,
					message: 'Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ xem xét và phản hồi sớm.',
				},
				'a3HIuoZOpEPvFXDv3'
			);

			notification.success({
				message: 'Gửi feedback thành công',
				description: 'Cảm ơn bạn đã gửi feedback. Chúng tôi sẽ xem xét và phản hồi sớm.',
			});
			form.resetFields();
		} catch (error) {
			notification.error({
				message: 'Gửi feedback thất bại',
				description: error.message,
			});
		}
	};

	return (
		<>
			<div
				style={{
					marginTop: '32px',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<h1>Đóng góp ý kiến</h1>
			</div>
			<Card style={{ marginTop: '32px' }}>
				<div style={{ position: 'relative' }}>
					<Divider orientation='left' style={{ margin: '0px' }}>
						Ý kiến của bạn
					</Divider>
				</div>
				<Form
					form={form}
					name='basic'
					layout='vertical'
					onFinish={handleSubmit}
				>
					<Form.Item
						label='Họ và tên'
						name='name'
						rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
					>
						<Input size='large' />
					</Form.Item>

					<Form.Item
						label='Địa chỉ email'
						name='email'
						rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }]}
					>
						<Input size='large' />
					</Form.Item>

					<Form.Item
						label='Ý kiến của bạn'
						name='content'
						rules={[{ required: true, message: 'Vui lòng nhập ý kiến của bạn!' }]}
					>
						<Input.TextArea size='large' />
					</Form.Item>

					<Button type='primary' htmlType='submit'>
						Gửi ý kiến
					</Button>
				</Form>
			</Card>
		</>
	);
};

export default Contact;
