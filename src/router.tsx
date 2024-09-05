import { createBrowserRouter } from 'react-router-dom';
import { AuthCallback } from './components/auth-callback';
import { MuseumMap } from './components/museum-map';
import { VisitsList } from './components/visits-list';
import Layout from './routes/layout';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: 'visits',
				element: <VisitsList />,
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
