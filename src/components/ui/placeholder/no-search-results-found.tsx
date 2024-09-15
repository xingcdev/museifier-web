import Box, { type BoxProps } from '@mui/material/Box';
import Img from '../../../assets/no-results-found.png';
import Typography from '@mui/material/Typography';

type NoSearchResultsFoundProps = BoxProps;

export function NoSearchResultsFound({
	children,
	...props
}: NoSearchResultsFoundProps) {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" {...props}>
			<Box textAlign="center">
				<img src={Img} alt="No results found" width={400} />
				<Typography variant="subtitle1" fontWeight={500}>
					{children}
				</Typography>
			</Box>
		</Box>
	);
}
