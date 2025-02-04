import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Img from '../../../assets/something-is-wrong.png';

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
				<img src={Img} alt="Something is wrong" width={400} />
				<Typography variant="subtitle1" fontWeight={500}>
					Il y a un problème, veuillez réessayer.
				</Typography>
			</Box>
		</Box>
	);
}
