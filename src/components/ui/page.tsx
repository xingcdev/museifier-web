import Container from '@mui/material/Container';
import type { ReactNode } from 'react';

export function Page({ children }: { children: ReactNode }) {
	return <Container sx={{ pt: 4 }}>{children}</Container>;
}
