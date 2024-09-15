import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Img from '../../../assets/get-started.png';

type GetStartedProps = BoxProps;

export function GetStarted({ children, ...props }: GetStartedProps) {
	return (
		<Box
			{...props}
			display="flex"
			justifyContent="center"
			alignItems="center"
			py={10}
		>
			<Box textAlign="center">
				<img src={Img} alt="No results found" width={400} />
				<Typography variant="subtitle1" fontWeight={500}>
					{children}
				</Typography>
			</Box>
		</Box>
	);
}
