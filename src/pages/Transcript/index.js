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
	Space,
	Table,
	Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';

const Transcript = () => {
	const [records, setRecords] = useState([]);

	const titleSubject = {
		html: 'HTML',
		css: 'CSS',
		javascript: 'JavaScript',
		reactjs: 'ReactJS',
		nodejs: 'NodeJS',
	};

	const columns = [
		{
			title: 'Mã đề thi',
			dataIndex: 'idExam',
			key: 'idExam',
		},
		{
			title: 'Môn thi',
			dataIndex: 'subject',
			key: 'subject',
			render: (value) => <div>{titleSubject[value]}</div>
		},
		{
			title: 'Tên đề thi',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Thời gian',
			dataIndex: 'time_progess',
			key: 'time_progess',
			render: (text) => {
				return <div>{(text / 60).toFixed(2)} phút</div>;
			},
		},
		{
			title: 'Điểm',
			dataIndex: 'score',
			key: 'score',
		},
	];
	// const data = [
	// 	{
	// 		key: '1',
	// 		name: 'John Brown',
	// 		age: 32,
	// 		address: 'New York No. 1 Lake Park',
	// 		tags: ['nice', 'developer'],
	// 	},
	// 	{
	// 		key: '2',
	// 		name: 'Jim Green',
	// 		age: 42,
	// 		address: 'London No. 1 Lake Park',
	// 		tags: ['loser'],
	// 	},
	// 	{
	// 		key: '3',
	// 		name: 'Joe Black',
	// 		age: 32,
	// 		address: 'Sydney No. 1 Lake Park',
	// 		tags: ['cool', 'teacher'],
	// 	},
	// ];

	const getHistories = async (subject) => {
		// Có thể sử dụng thử viện axios
		const response = await fetch(`http://localhost:5000/histories`);
		const histories = await response.json();

		setRecords(histories);
	};

	useEffect(() => {
		getHistories();
	}, []);

	return (
		<>
			<div
				style={{
					marginTop: '32px',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<h1>Bảng điểm cá nhân</h1>
			</div>
			<div style={{ marginTop: '32px' }}>
				<Table columns={columns} dataSource={records} />
			</div>
		</>
	);
};

export default Transcript;
