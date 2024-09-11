import {
	Avatar,
	Button,
	Checkbox,
	Dropdown,
	Form,
	Input,
	Modal,
	notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import './navigation.css';
import { useFormik } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';

const FormLogin = ({ onRegister, formLogin }) => {
	return (
		<Form name='basic' layout='vertical'>
			<Form.Item
				label='Email'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formLogin.errors.email && 'error'}
				help={formLogin.errors.email && formLogin.errors.email}
			>
				<Input
					size='large'
					name='email'
					onChange={formLogin.handleChange}
					value={formLogin.values.email}
				/>
			</Form.Item>

			<Form.Item
				label='Mật khẩu'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formLogin.errors.password && 'error'}
				help={formLogin.errors.password && formLogin.errors.password}
			>
				<Input.Password
					size='large'
					name='password'
					onChange={formLogin.handleChange}
					value={formLogin.values.password}
				/>
			</Form.Item>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Form.Item name='remember' valuePropName='checked'>
					<Checkbox>Ghi nhớ mật khẩu</Checkbox>
				</Form.Item>

				<Button type='link' onClick={onRegister}>
					Đăng ký
				</Button>
				<GoogleLoginButton />
			</div>
		</Form>
	);
};

const FormRegister = ({ formRegister }) => {
	return (
		<Form name='basic' layout='vertical'>
			<Form.Item
				label='Email'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.email && 'error'}
				help={formRegister.errors.email && formRegister.errors.email}
			>
				<Input
					size='large'
					name='email'
					onChange={formRegister.handleChange}
					value={formRegister.values.email}
				/>
			</Form.Item>
			<Form.Item
				label='Tên tài khoản'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.username && 'error'}
				help={formRegister.errors.username && formRegister.errors.username}
			>
				<Input
					size='large'
					name='username'
					onChange={formRegister.handleChange}
					value={formRegister.values.username}
				/>
			</Form.Item>
			<Form.Item
				label='Mật khẩu'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.password && 'error'}
				help={formRegister.errors.password && formRegister.errors.password}
			>
				<Input.Password
					size='large'
					name='password'
					onChange={formRegister.handleChange}
					value={formRegister.values.password}
				/>
			</Form.Item>
		</Form>
	);
};

const Navigation = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [statusModal, setStatusModal] = useState('login');
	const [listUser, setListUser] = useState([]);
	const [api, contextHolder] = notification.useNotification();

	const { isAuthenticated, login, logout, userCurrent } = useAuth();

	const items = [
		{
			key: '1',
			label: <Link to='/profile'>Thông tin</Link>,
		},
		{
			key: '2',
			label: <Link to='/profile'>Đổi mật khẩu</Link>,
		},
		{
			key: '3',
			label: <div onClick={logout}>Đăng xuất</div>,
		},
		{
			type: 'divider',
		},
		userCurrent?.role === 'admin' && {
			key: '4',
			label: <Link to='/admin'>Quản trị</Link>,
		},
	];

	const formLogin = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email('Chưa đúng định dạng email')
				.required('Chưa nhập email'),
			password: Yup.string()
				.min(6, 'Password chưa hợp lệ')
				.max(18, 'Too Long!')
				.required('Chưa nhập mật khẩu'),
		}),
		onSubmit: (values) => {
			let isLoginSuccess = false;
			let userLogin = null;

			for (let user of listUser) {
				if (user.email === values.email && user.password === values.password) {
					isLoginSuccess = true;

					userLogin = user;
				}
			}

			if (isLoginSuccess) {
				api.success({
					message: 'Đăng nhập thành công',
				});

				login(userLogin);

				setIsModalOpen(false);
			} else {
				api.error({
					message: 'Đăng nhập thất bại',
				});
			}
		},
	});

	const formRegister = useFormik({
		initialValues: {
			email: '',
			username: '',
			password: '',
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email('Chưa đúng định dạng email')
				.required('Chưa nhập email'),
			username: Yup.string()
				.min(2, 'Tên chưa hợp lệ')
				.max(24, 'Tên chưa hợp lệ')
				.required('Chưa nhập tên tài khoản'),
			password: Yup.string()
				.min(6, 'Password chưa hợp lệ')
				.max(18, 'Password chưa hợp lệ')
				.required('Chưa nhập mật khẩu'),
		}),
		onSubmit: async (values) => {
			let isExistEmail = false;

			for (let user of listUser) {
				if (user.email === values.email) {
					isExistEmail = true;
				}
			}

			if (isExistEmail) {
				api.error({
					message: 'Đăng ký thất bại',
					description: 'Email đã tồn tại!',
				});
			} else {
				const newUser = { ...values, role: 'user' };

				try {
					const response = await fetch('http://localhost:5000/users', {
						method: 'POST',
						body: JSON.stringify(newUser),
						headers: {
							'Content-Type': 'application/json',
						},
					});

					api.success({
						message: 'Đăng ký thành công',
					});

					setListUser([...listUser, newUser]);
					setIsModalOpen(false);

					login(newUser);
				} catch (e) {
					api.error({
						message: 'Đăng ký thất bại',
						description: 'Email đã tồn tại!',
					});
				}
			}
		},
	});

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleOk = () => {
		if (statusModal === 'login') {
			formLogin.handleSubmit();
		} else {
			formRegister.handleSubmit();
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleLogin = () => {
		setStatusModal('login');
		handleOpenModal();
	};

	const handleRegister = () => {
		setStatusModal('register');
		handleOpenModal();
	};

	const getListUser = async () => {
		// Có thể sử dụng thử viện axios
		const response = await fetch('http://localhost:5000/users');
		const users = await response.json();

		setListUser(users);
	};

	useEffect(() => {
		getListUser();
	}, []);

	useEffect(() => {
		if (isModalOpen === false) {
			console.log('Đóng modal');
			formLogin.resetForm();
			formRegister.resetForm();
		}
	}, [isModalOpen]);

	return (
		<>
			{contextHolder}
			<nav className='nav-app'>
				<div className='wrapper'>
					<div className='logo'>
						<Link to='#'>Thi Online</Link>
					</div>
					<input type='radio' name='slider' id='menu-btn' />
					<input type='radio' name='slider' id='close-btn' />
					<ul className='nav-links'>
						<label htmlFor='close-btn' className='btn close-btn'>
							<i className='fas fa-times' />
						</label>
						<li>
							<NavLink to='/'>Trang chủ</NavLink>
						</li>
						<li>
							<NavLink to='/list-exams?subject=all' className='desktop-item'>
								Môn thi
							</NavLink>
							<input type='checkbox' id='showDrop' />
							<label htmlFor='showDrop' className='mobile-item'>
								Dropdown Menu
							</label>
							<ul className='drop-menu'>
								<li>
									<NavLink to='/list-exams?subject=html'>HTML</NavLink>
								</li>
								<li>
									<NavLink to='/list-exams?subject=css'>CSS</NavLink>
								</li>
								<li>
									<NavLink to='/list-exams?subject=javascript'>
										Javascript
									</NavLink>
								</li>
								<li>
									<NavLink to='/list-exams?subject=reactjs'>ReactJS</NavLink>
								</li>
								<li>
									<NavLink to='/list-exams?subject=nodejs'>NodeJS</NavLink>
								</li>
							</ul>
						</li>
						{isAuthenticated && (
							<li>
								<NavLink to='/transcript'>Bảng điểm</NavLink>
							</li>
						)}

						<li>
							<NavLink to='/contact'>Liên hệ</NavLink>
						</li>
					</ul>
					<label htmlFor='menu-btn' className='btn menu-btn'>
						<i className='fas fa-bars' />
					</label>

					<div className='profile'>
						{isAuthenticated ? (
							<>
								{/* Đã đăng nhập */}
								<Dropdown menu={{ items }} placement='top'>
									<Avatar
										size='large'
										style={{ width: '55px', height: '55px' }}
									>
										{userCurrent.username}
									</Avatar>
								</Dropdown>
							</>
						) : (
							<>
								{/* Chưa đăng nhập */}
								<Button style={{ margin: '0px 8px' }} onClick={handleRegister}>
									Đăng ký
								</Button>
								<Button style={{ margin: '0px 8px' }} onClick={handleLogin}>
									Đăng nhập
								</Button>
							</>
						)}
					</div>
				</div>
			</nav>
			<Modal
				title={statusModal === 'login' ? 'Đăng nhập' : 'Đăng ký'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				okText={statusModal === 'login' ? 'Đăng nhập' : 'Đăng ký'}
				cancelText='Đóng lại'
				maskClosable={false}
			>
				{statusModal === 'login' ? (
					<FormLogin onRegister={handleRegister} formLogin={formLogin} />
				) : (
					<FormRegister formRegister={formRegister} />
				)}
			</Modal>
		</>
	);
};

export default Navigation;
