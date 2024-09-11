import React from 'react';
import { Outlet } from 'react-router-dom';
import DefaultLayoutAdmin from '../../layouts/DefaultLayoutAdmin';

const Admin = () => {
	return (
		<DefaultLayoutAdmin>
			<Outlet />
		</DefaultLayoutAdmin>
	);
};

export default Admin;
