import Container, { type ContainerProps } from '@mui/material/Container';

export function Page({ sx, ...props }: ContainerProps) {
	return <Container {...props} sx={{ pt: 4, ...sx }} />;
}
