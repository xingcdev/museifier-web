import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Page } from '../page';

export default function UnexpectedErrorPage() {
	return (
		<Page
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				py: 20,
			}}
		>
			<Box>
				<img src="/unexpected-error.png" alt="Unexpected error" width={400} />
				<Typography variant="h4" component="h1" gutterBottom>
					Oops!
				</Typography>
				<Typography fontWeight={500} mb={2}>
					Sorry, an unexpected error has occurred.
				</Typography>
				<Link href="/">Go back to home</Link>
			</Box>
		</Page>
	);
}
