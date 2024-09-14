import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { Copyright } from './copyright';

export function AppFooter() {
	return (
		<Box component="footer" p={3}>
			<Container>
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
			</Container>
		</Box>
	);
}
