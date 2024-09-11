import { Avatar, Button, Divider, Input, List, Modal, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ManageFeedback = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState(''); // Nội dung phản hồi từ admin
	const [feedbacks, setFeedbacks] = useState([]); // Danh sách feedback từ server
	const [selectedFeedback, setSelectedFeedback] = useState(null); // Feedback được chọn để phản hồi

	// Hiển thị modal phản hồi
	const showModal = (feedback) => {
		setSelectedFeedback(feedback); // Lưu lại phản hồi mà admin muốn xem và phản hồi
		setIsModalOpen(true); // Mở modal
	};

	// Xử lý khi admin bấm nút Gửi phản hồi
	const handleOk = async () => {
		if (selectedFeedback) {
			try {
				// Gửi email phản hồi qua EmailJS
				await emailjs.send(
					'service_fsu3far', // Thay bằng Service ID của bạn
					'template_c0oiy6h', // Thay bằng Template ID của bạn
					{
						name: selectedFeedback.name, // Tên người gửi feedback
						email: selectedFeedback.email, // Email của người gửi feedback
						message: content, // Nội dung phản hồi từ admin
					},
					'a3HIuoZOpEPvFXDv3' // Thay bằng User ID của bạn
				);

				notification.success({
					message: 'Gửi phản hồi thành công',
				});

				setContent(''); // Xóa nội dung phản hồi
				setIsModalOpen(false); // Đóng modal
				fetchFeedbacks(); // Cập nhật lại danh sách feedback
			} catch (error) {
				notification.error({
					message: 'Gửi phản hồi thất bại',
					description: error.message,
				});
			}
		}
	};

	// Đóng modal
	const handleCancel = () => {
		setIsModalOpen(false); // Đóng modal
	};

	// Lấy danh sách phản hồi từ JSON Server
	const fetchFeedbacks = async () => {
		try {
			const response = await fetch('http://localhost:5000/feedback'); // URL JSON Server
			const data = await response.json();
			setFeedbacks(data); // Lưu danh sách feedback
		} catch (error) {
			console.error('Error fetching feedbacks:', error);
		}
	};

	// Lấy danh sách phản hồi khi component được mount
	useEffect(() => {
		fetchFeedbacks();
	}, []);

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '12px',
				}}
			>
				<h1>Hòm thư góp ý</h1>
			</div>
			<Modal
				title={`Phản hồi ý kiến của: ${selectedFeedback?.name || ''}`} // Hiển thị tên người gửi feedback
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				width={650}
				okText='Gửi'
				cancelText='Đóng lại'
			>
				{/* Hiển thị email và nội dung feedback của người dùng */}
				<p>Email: {selectedFeedback?.email || ''}</p>
				<p>Nội dung feedback: {selectedFeedback?.message || ''}</p>
				<Divider />
				{/* Nhập nội dung phản hồi từ admin */}
				<Input.TextArea
					placeholder='Nội dung phản hồi từ admin'
					style={{
						height: '150px',
					}}
					value={content}
					onChange={(event) => setContent(event.target.value)}
				/>
			</Modal>

			{/* Hiển thị danh sách phản hồi */}
			<div>
				<List
					dataSource={feedbacks}
					renderItem={(item) => (
						<List.Item key={item.id}>
							<List.Item.Meta
								avatar={
									<Avatar style={{ width: '40px', height: '40px' }}>
										{item.name.charAt(0).toUpperCase()}
									</Avatar>
								}
								title={`Phản hồi từ: ${item.name}`}
								description={`Email: ${item.email} - Nội dung: ${item.content}`} // Hiển thị tóm tắt nội dung feedback
							/>
							<Button type='link' onClick={() => showModal(item)}>
								Phản hồi
							</Button>
						</List.Item>
					)}
				/>
			</div>
		</div>
	);
};

export default ManageFeedback;
