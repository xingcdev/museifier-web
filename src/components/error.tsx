import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface ApiErrorAlertProps extends BoxProps {
	text: string;
}

export function Error({
	text = 'Something is wrong, please try again.',
	...props
}: ApiErrorAlertProps) {
	return (
		<Box
			{...props}
			bgcolor="error.bg"
			sx={{}}
			p={2}
			borderRadius={1}
			display="flex"
			border={1}
			borderColor="error.light"
		>
			<ErrorOutlineIcon color="error" />
			<Typography color="error.main" ml={1}>
				{text}
			</Typography>
		</Box>
	);
}
