import React from 'react';
import {
	DashboardOutlined,
	FileTextOutlined,
	LaptopOutlined,
	LoginOutlined,
	MailOutlined,
	NotificationOutlined,
	UserOutlined,
} from '@ant-design/icons';
import './styles.css';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Content, Sider } = Layout;

const DefaultLayoutAdmin = (props) => {
	const navigate = useNavigate();

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const listNav = [
		{
			key: '',
			icon: <DashboardOutlined />,
			label: 'Trang chủ',
		},
		{
			key: 'mange-exams',
			icon: <FileTextOutlined />,
			label: 'Đề thi',
			children: [
				{
					key: 'exams',
					label: 'Danh sách đề thi',
				},
				{
					key: 'exams/create',
					label: 'Tạo đề thi',
				},
			],
		},
		{
			key: 'mange-users',
			icon: <UserOutlined />,
			label: 'Người dùng',
			children: [
				{
					key: 'users',
					label: 'Danh sách người dùng',
				},
			],
		},
		{
			key: 'mange-feedback',
			icon: <MailOutlined />,
			label: 'Hòm thư góp ý',
			children: [
				{
					key: 'feedback',
					label: 'Danh sách phản hồi',
				},
			],
		},
		{
			key: 'manage-subjects',
			icon: <LaptopOutlined />,
			label: 'Môn thi',
			children: [
			  {
				key: 'subjects',
				label: 'Danh sách môn thi',
			  },
			],
		  },
		{
			key: 'logout',
			icon: <LoginOutlined />,
			label: 'Quay lại trang người dùng',
		},
	];

	const handleRedirectPage = (menu) => {
		console.log('menu: ', menu);
		if (menu.key === 'logout') {
			navigate('/');
			return;
		}
		navigate(`./${menu.key}`);
	};

	return (
		<div className='nav-admin'>
			<Layout>
				<Layout>
					<Sider
						width={300}
						style={{
							background: colorBgContainer,
						}}
					>
						<Menu
							mode='inline'
							defaultSelectedKeys={['1']}
							defaultOpenKeys={['sub1']}
							style={{
								height: '100%',
								borderRight: 0,
							}}
							onClick={handleRedirectPage}
							items={listNav}
						/>
					</Sider>
					<Layout
						style={{
							padding: '0 24px 24px',
						}}
					>
						<Breadcrumb
							style={{
								margin: '16px 0',
							}}
						>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>List</Breadcrumb.Item>
							<Breadcrumb.Item>DefaultLayoutAdmin</Breadcrumb.Item>
						</Breadcrumb>
						<Content
							style={{
								padding: 24,
								margin: 0,
								minHeight: 280,
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
							}}
						>
							{props.children}
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</div>
	);
};
export default DefaultLayoutAdmin;
