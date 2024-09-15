import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Img from '../../../assets/not-found.png';
import { AppHeader } from '../../app-header';
import { AppFooter } from '../app-footer';
import { Page } from '../page';

export default function NotFoundPage() {
	return (
		<>
			<AppHeader />
			<Page
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '80vh',
				}}
			>
				<Box>
					<img src={Img} alt="Not found" width={400} />
					<Typography variant="h3" component="h1">
						404
					</Typography>
					<Typography variant="h6" component="p" mb={2}>
						Oops, vous semblez être perdu...
					</Typography>
					<Link href="/">Page d'accueil</Link>
				</Box>
			</Page>
			<AppFooter />
		</>
	);
}
