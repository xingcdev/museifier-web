import Typography, { type TypographyProps } from '@mui/material/Typography';

export function Copyright(props: TypographyProps) {
	return (
		<Typography color="textSecondary" {...props}>
			© 2024 Muséifier
		</Typography>
	);
}
