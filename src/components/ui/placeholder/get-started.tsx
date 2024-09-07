import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type GetStartedProps = BoxProps;

export function GetStarted({ children }: GetStartedProps) {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" py={10}>
			<Box textAlign="center">
				<img src="/get-started.png" alt="No results found" width={400} />
				<Typography variant="subtitle1" fontWeight={500}>
					{children}
				</Typography>
			</Box>
		</Box>
	);
}
