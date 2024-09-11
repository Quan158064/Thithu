import {
	ClockCircleOutlined,
	QuestionCircleOutlined,
	StarOutlined,
	StockOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Input, List, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { convertTitleToSlug } from '../../helpers';
import { useNavigate } from 'react-router-dom';
import Ranking from './Ranking';

const { Search } = Input;
const { Option } = Select;

const Home = () => {
	const navigate = useNavigate();
	const [listExam, setListExam] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSubject, setSelectedSubject] = useState(''); // Trạng thái lưu môn học được chọn
	const subjects = [
		{
			value: 'html',
			label: 'HTML',
		},
		{
			value: 'css',
			label: 'CSS',
		},
		{
			value: 'javascript',
			label: 'JavaScript',
		},
		{
			value: 'reactjs',
			label: 'ReactJS',
		},
	];

	// Hàm lấy danh sách đề thi dựa trên môn học hoặc từ khóa tìm kiếm
	const getListExam = async (subject = '', search = '') => {
		try {
			let query = `http://localhost:5000/exams?`;
			if (subject) query += `subject=${subject}&`;
			if (search) query += `q=${search}&`;

			const response = await fetch(query);
			const exams = await response.json();
			setListExam(exams);
		} catch (error) {
			console.error('Lỗi khi lấy dữ liệu:', error);
		}
	};

	// Hàm cập nhật timesTaken
	const updateTimesTaken = async (exam) => {
		try {
			const timesTakenResponse = await fetch(`http://localhost:5000/timesTaken`);
			const timesTakenList = await timesTakenResponse.json();

			const existingTimesTaken = timesTakenList.find(
				(item) => item.id === exam.id
			);

			let newTimesTakenValue;

			if (existingTimesTaken) {
				newTimesTakenValue = existingTimesTaken.timesTaken + 1;

				await fetch(`http://localhost:5000/timesTaken/${existingTimesTaken.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						...existingTimesTaken,
						timesTaken: newTimesTakenValue,
					}),
				});
			} else {
				newTimesTakenValue = 1;

				await fetch(`http://localhost:5000/timesTaken`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: exam.id,
						title: exam.title,
						subject: exam.subject,
						numQuestions: exam.questions.length,
						duration: exam.time,
						maxScore: exam.highest_point || 10,
						level: exam.level,
						timesTaken: newTimesTakenValue,
					}),
				});
			}

			message.success(`Cập nhật số lần thi cho đề "${exam.title}" thành công!`);

			let slug = convertTitleToSlug(exam.title);
			slug = `${slug}-${exam.id}.html`;
			navigate(`/detail/${slug}`);
		} catch (error) {
			console.error('Lỗi khi cập nhật timesTaken:', error);
			message.error('Có lỗi xảy ra khi cập nhật số lần thi.');
		}
	};

	// Fetch dữ liệu ban đầu
	useEffect(() => {
		getListExam();
	}, []);

	// Lọc danh sách đề thi theo từ khóa tìm kiếm và môn học
	const filteredExams = listExam.filter((exam) =>
		exam.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<div style={{ marginTop: '32px' }}>
				<h1>Tuyển chọn các đề thi</h1>
				<Search
					placeholder="Tìm kiếm đề thi theo tên"
					allowClear
					enterButton="Tìm kiếm"
					size="large"
					onSearch={(value) => {
						setSearchTerm(value);
						getListExam(selectedSubject, value); // Tìm kiếm dựa trên từ khóa
					}}
					style={{ width: '50%', marginBottom: '16px' }}
				/>

				<Select
					placeholder="Chọn môn học"
					style={{ width: '50%', marginBottom: '16px' }}
					onChange={(value) => {
						setSelectedSubject(value);
						getListExam(value, searchTerm); // Lấy dữ liệu theo môn học đã chọn
					}}
				>
					{subjects.map((subject) => (
						<Option key={subject.value} value={subject.value}>
							{subject.label}
						</Option>
					))}
				</Select>
			</div>

			<Card style={{ marginTop: '32px' }}>
				<List
					className="demo-loadmore-list"
					itemLayout="horizontal"
					dataSource={filteredExams}
					renderItem={(exam) => (
						<List.Item
							actions={[
								<Button onClick={() => updateTimesTaken(exam)}>Thi thử</Button>,
							]}
						>
							<List.Item.Meta
								avatar={
									<Avatar style={{ height: '50px', width: '50px' }}>
										{exam.subject}
									</Avatar>
								}
								title={exam.title}
								description={
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div>
											<QuestionCircleOutlined />
											<span style={{ marginLeft: '4px' }}>
												{exam.questions.length} câu
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<ClockCircleOutlined />
											<span style={{ marginLeft: '4px' }}>
												{exam.time} phút
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<StarOutlined />
											<span style={{ marginLeft: '4px' }}>
												Điểm cao nhất: {exam.highest_point || 10}
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<StockOutlined />
											<span style={{ marginLeft: '4px' }}>
												Mức độ: {exam.level}
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											Số lần thi: {exam.timesTaken || 0}
										</div>
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			</Card>

			<Ranking />
		</>
	);
};

export default Home;
