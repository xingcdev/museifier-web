import Typography, { type TypographyProps } from '@mui/material/Typography';

export function Copyright(props: TypographyProps) {
	return (
		<Typography color="textPrimary" {...props}>
			© 2024 Xing Chen
		</Typography>
	);
}
