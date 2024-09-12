import { createBrowserRouter } from 'react-router-dom';
import { AuthCallback } from './components/auth-callback';
import NotFoundPage from './components/ui/errors/not-found-page';
import Layout from './routes/layout';
import { Museum } from './routes/museum';
import { MuseumMap } from './routes/museum-map';
import { MuseumsList } from './routes/museums-list';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <NotFoundPage />,
		children: [
			{
				path: '',
				element: <MuseumsList />,
			},
			{
				path: 'map',
				element: <MuseumMap />,
			},
			{
				path: 'museums/:museumId',
				element: <Museum />,
			},
		],
	},
	{
		path: '/callback',
		element: <AuthCallback />,
	},
]);
