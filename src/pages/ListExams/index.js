import {
	ClockCircleOutlined,
	QuestionCircleOutlined,
	SearchOutlined,
	StarOutlined,
	StockOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Divider,
	Input,
	List,
	Select,
	Skeleton,
	Empty,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { convertTitleToSlug } from '../../helpers';

const ListExams = () => {
	const navigate = useNavigate();
	const [searchParms] = useSearchParams(); // Lấy searchParams từ URL
	const subjectFilter = searchParms.get('subject'); // Lấy bộ lọc subject từ URL
	const [levelFilter, setLevelFilter] = useState('all'); // Lọc theo level

	// Tên các môn học
	const titleSubject = {
		html: 'HTML',
		css: 'CSS',
		javascript: 'JavaScript',
		reactjs: 'ReactJS',
		nodejs: 'NodeJS',
	};

	// Tên các mức độ
	const titleLevel = {
		basic: 'Cơ bản',
		medium: 'Trung bình',
		advanced: 'Nâng cao',
	};

	// State lưu trữ danh sách đề thi
	const [listExam, setListExam] = useState([]);
	const [loading, setLoading] = useState(true); // Trạng thái loading

	// Hàm lấy danh sách đề thi từ API dựa theo subject
	const getListExam = async (subject) => {
		try {
			setLoading(true); // Bắt đầu loading
			const response = await fetch(
				`http://localhost:5000/exams?subject=${subject}`
			);
			const exams = await response.json();
			setListExam(exams);
		} catch (error) {
			console.error('Lỗi khi lấy danh sách đề thi:', error);
		} finally {
			setLoading(false); // Kết thúc loading
		}
	};

	// Xử lý thay đổi bộ lọc level
	const handleChangeLevel = (value) => {
		setLevelFilter(value);
	};

	// Hàm điều hướng khi nhấn "Thi thử"
	const handleRedirect = (exam) => {
		let slug = convertTitleToSlug(exam.title);
		slug = `${slug}-${exam.id}.html`;
		navigate(`/detail/${slug}`);
	};

	// Gọi API để lấy danh sách đề thi mỗi khi subjectFilter thay đổi
	useEffect(() => {
		if (subjectFilter) {
			getListExam(subjectFilter);
		}
	}, [subjectFilter]);

	// Hiển thị loading khi dữ liệu đang được lấy
	if (loading) {
		return <Skeleton active />;
	}

	return (
		<>
			<div
				style={{
					marginTop: '32px',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<h1>Đề thi {titleSubject[subjectFilter]}</h1>

				<Input
					prefix={<SearchOutlined />}
					style={{ height: '35px', width: '230px' }}
					placeholder="Tìm kiếm đề thi"
				/>
			</div>

			<Card style={{ marginTop: '32px' }}>
				<div style={{ position: 'relative' }}>
					<Divider orientation='left' style={{ margin: '0px' }}>
						{titleSubject[subjectFilter]}
					</Divider>
					<Select
						onChange={handleChangeLevel}
						value={levelFilter}
						style={{
							width: 150,
							position: 'absolute',
							right: '8px',
							top: '-4px',
						}}
						options={[
							{ value: 'all', label: 'Tất cả' },
							{
								value: 'basic',
								label: 'Cơ bản',
							},
							{
								value: 'medium',
								label: 'Trung bình',
							},
							{
								value: 'advanced',
								label: 'Nâng cao',
							},
						]}
					/>
				</div>
				<List
					className='demo-loadmore-list'
					itemLayout='horizontal'
					dataSource={
						levelFilter === 'all'
							? listExam
							: listExam.filter((exam) => exam.level === levelFilter)
					}
					locale={{ emptyText: <Empty description="Không có đề thi nào." /> }} // Hiển thị thông báo khi không có đề thi
					renderItem={(exam) => (
						<List.Item
							actions={[
								<Button onClick={() => handleRedirect(exam)}>Thi thử</Button>,
							]}
						>
							<List.Item.Meta
								avatar={
									<Avatar style={{ height: '50px', width: '50px' }}>
										{titleSubject[subjectFilter]?.charAt(0).toUpperCase()}
									</Avatar>
								}
								title={exam.title}
								description={
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div>
											<QuestionCircleOutlined />
											<span style={{ marginLeft: '4px' }}>
												{exam?.questions?.length} câu
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<ClockCircleOutlined />
											<span style={{ marginLeft: '4px' }}>
												{exam?.time} phút
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<StarOutlined />
											<span style={{ marginLeft: '4px' }}>
												Điểm cao nhất: {exam?.highest_point ?? 'Chưa có'}
											</span>
										</div>
										<div style={{ marginLeft: '12px' }}>
											<StockOutlined />
											<span style={{ marginLeft: '4px' }}>
												Mức độ: {titleLevel[exam?.level] ?? 'Chưa xác định'}
											</span>
										</div>
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			</Card>
		</>
	);
};

export default ListExams;
