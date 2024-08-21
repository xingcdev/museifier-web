import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function LoadingPage() {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			flexDirection="column"
			py={35}
		>
			<Box
				sx={{
					width: 48,
					height: 48,
					border: 5,
					borderColor: 'primary.main',
					borderBottomColor: 'transparent',
					borderRadius: '50%',
					display: 'inline-block',
					animation: 'rotation 1s linear infinite',
					'@keyframes rotation': {
						'0%': {
							transform: 'rotate(0deg)',
						},
						'100%': {
							transform: 'rotate(360deg)',
						},
					},
				}}
			></Box>
			<Typography mt={2} fontWeight={600}>
				Loading...
			</Typography>
		</Box>
	);
}
