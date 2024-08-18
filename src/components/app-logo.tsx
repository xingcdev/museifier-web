import Logo from '@mui/icons-material/ChangeHistoryOutlined';
import Link from '@mui/material/Link';
import Stack, { type StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function AppLogo(props: StackProps) {
	return (
		<Stack direction="row" alignItems="center" {...props}>
			<Logo sx={{ mr: 1 }} fontSize="large" />
			<Typography
				variant="h6"
				noWrap
				component={Link}
				href="/"
				sx={{
					fontFamily: 'monospace',
					fontWeight: 700,
					letterSpacing: '.3rem',
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				MUSEUM
			</Typography>
		</Stack>
	);
}
