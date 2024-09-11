import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ListExams from './pages/ListExams';
import Contact from './pages/Contact';
import DetailExam from './pages/DetailExam';
import Transcript from './pages/Transcript';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Admin from './pages/Admin';
import CreateExam from './pages/Admin/ManageExams/CreateExam';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageExams from './pages/Admin/ManageExams';
import ManageFeedback from './pages/Admin/ManageFeedback';
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Admin/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ManageSubjects from './pages/Admin/ManageSubjects';

const PrivateRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? children : <Navigate to='/' />;
};

const App = () => {
	return (
		<div>
			<AuthProvider>
				<Routes>
					<Route path='/' element={<DefaultLayout />}>
						<Route path='' element={<Home />} />
						<Route path='list-exams' element={<ListExams />} />
						<Route path='contact' element={<Contact />} />
						<Route path='detail/:idExam' element={<DetailExam />} />
						<Route
							path='transcript'
							element={
								<PrivateRoute>
									<Transcript />
								</PrivateRoute>
							}
						/>
						<Route
							path='profile'
							element={
								<PrivateRoute>
									<Profile />
								</PrivateRoute>
							}
						/>
						<Route
							path='change-password'
							element={
								<PrivateRoute>
									<ChangePassword />
								</PrivateRoute>
							}
						/>
					</Route>
					<Route path='/admin' element={<Admin />}>
						<Route index element={<Dashboard />} />
						<Route path='exams' element={<ManageExams />} />
						<Route path='exams/create' element={<CreateExam />} />
						<Route path='exams/update/:idExam' element={<CreateExam />} />
						<Route path='users' element={<ManageUsers />} />
						<Route path='feedback' element={<ManageFeedback />} />
						<Route path='subjects' element={<ManageSubjects />} />
					</Route>
				</Routes>
			</AuthProvider>
		</div>
	);
};

export default App;
