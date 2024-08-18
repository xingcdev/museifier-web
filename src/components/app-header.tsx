import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { UseAuth } from '../hooks/useAuth';
import { AppLogo } from './app-logo';

const pages = [
	{ href: '/visits', label: 'My visits' },
	{ href: '/museums', label: 'Discover museums' },
];
const settings = ['Your profile', 'Log out'];

export function AppHeader() {
	const { user } = UseAuth();
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<Paper component="header" sx={{ py: 2 }}>
			<Container>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					{/* Desktop */}
					<AppLogo sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }} />

					{/* Hamburger button */}
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.label} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">{page.label}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					{/* Mobile */}
					<AppLogo sx={{ display: { xs: 'flex', md: 'none' } }} />

					<Stack
						flexGrow={1}
						direction="row"
						spacing={2}
						sx={{ display: { xs: 'none', md: 'flex' } }}
					>
						{pages.map((page) => (
							<Typography
								component={Link}
								key={page.label}
								href={page.href}
								sx={{
									textDecoration: 'none',
									color: 'text.primary',
									fontWeight: 500,
								}}
							>
								{page.label}
							</Typography>
						))}
					</Stack>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar>H</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{user?.username && <MenuItem>{user.username}</MenuItem>}
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Stack>
			</Container>
		</Paper>
	);
}
