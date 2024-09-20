import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { Copyright } from './copyright';

export function AppFooter() {
	return (
		<Container
			component="footer"
			sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}
		>
			<Box>
				<Copyright />
				<IconButton
					aria-label="LinkedIn"
					href="https://www.linkedin.com/in/xing-chen-28739319b/"
				>
					<LinkedInIcon fontSize="medium" />
				</IconButton>
				<IconButton aria-label="GitHub" href="https://github.com/xingcdev">
					<GitHubIcon fontSize="medium" />
				</IconButton>
			</Box>

			<Link color="textPrimary" sx={{ textDecoration: 'none' }} href="/terms">
				Mentions légales
			</Link>
		</Container>
	);
}
