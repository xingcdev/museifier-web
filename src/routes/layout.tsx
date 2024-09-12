import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/app-header';
import { RequireAuth } from '../components/require-auth';
import { AppFooter } from '../components/ui/app-footer';

export default function Layout() {
	return (
		<RequireAuth>
			<AppHeader />
			<Outlet />
			<AppFooter />
		</RequireAuth>
	);
}
