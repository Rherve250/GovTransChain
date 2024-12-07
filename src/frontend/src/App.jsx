import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Program from './pages/Program';
import AdminDashboard from './pages/AdminDashboard';
import Stock from './pages/Stock';
import Users from './pages/AllUser';
import ProfilePage from './pages/ProfilePage';
import ProfileForm from './myComponents/ProfileForm';
import HomePage from './pages/HomePage';
import { AuthContextProvider } from './context/AuthContext';
import RequestPage from './pages/RequestPage';

const routes = [
	{
		path: '/Admin',
		element:<AuthContextProvider><Layout /></AuthContextProvider> ,
		children: [
			{ path: 'Programs/', element: <Program /> },
		    {path: "Dashboard/", element: <AdminDashboard/>},
			{path: "Stocks", element: <Stock/>},
			{path: "Users", element: <Users/>},
			{path: "Programs/:id/Request/", element: <RequestPage/>}
		],

	},
	{
		path: '/',
		element: <ProfilePage/>,
		children: [
			{path: "/", element: <HomePage/>},
			{ path: 'Profile/', element: <AuthContextProvider><ProfileForm /></AuthContextProvider> },
		],

	},
];
const router = (
	<BrowserRouter>
		<Routes>
			{routes.map((route) => (
				<Route key={route.path} path={route.path} element={route.element}>
					{route.children.map((child) => (
						<Route key={child.path} path={child.path} element={child.element} />
					))}
				</Route>
			))}
		</Routes>
	</BrowserRouter>
);
const App = () => {
	return router;
};

export default App;
