import { createBrowserRouter } from 'react-router-dom';
import { AuthCallback } from './components/auth-callback';
import Layout from './routes/layout';
import { MuseumMap } from './routes/museum-map';
import { MuseumsList } from './routes/museums-list';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '',
				element: <MuseumsList />,
			},
			{
				path: 'map',
				element: <MuseumMap />,
			},
		],
	},
	{
		path: '/callback',
		element: <AuthCallback />,
	},
]);
