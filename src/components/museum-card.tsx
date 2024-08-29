import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export interface VisitCardProps extends CardProps {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	url: string;
}

export function MuseumCard({
	name,
	address,
	postalCode,
	city,
	url,
	...props
}: VisitCardProps) {
	return (
		<Card
			{...props}
			variant="outlined"
			sx={{ display: 'flex', p: 3, ...props.sx }}
		>
			<img src="/vite.svg" alt="museum" loading="lazy" />
			<Box ml={2}>
				<Typography fontWeight={500} textTransform="capitalize">
					{name}
				</Typography>
				<Typography>{address}</Typography>
				<Typography>
					{postalCode} {city}
				</Typography>
				<Link color="text.secondary" href={url}>
					{url}
				</Link>
			</Box>
		</Card>
	);
}
