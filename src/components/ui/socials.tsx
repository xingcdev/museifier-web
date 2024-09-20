import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export function Socials() {
	return (
		<Box>
			<IconButton
				size="small"
				aria-label="LinkedIn"
				href="https://www.linkedin.com/in/xing-chen-28739319b/"
			>
				<LinkedInIcon fontSize="medium" />
			</IconButton>
			<IconButton
				aria-label="GitHub"
				href="https://github.com/xingcdev"
				size="small"
			>
				<GitHubIcon fontSize="medium" />
			</IconButton>
		</Box>
	);
}
