import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function SomethingIsWrong(props: BoxProps) {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			py={10}
			{...props}
		>
			<Box textAlign="center">
				<img
					src="/something-is-wrong.png"
					alt="Something is wrong"
					width={400}
				/>
				<Typography variant="subtitle1" fontWeight={500}>
					Something is wrong, please try again.
				</Typography>
			</Box>
		</Box>
	);
}
