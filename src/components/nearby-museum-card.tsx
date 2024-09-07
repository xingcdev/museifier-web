import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export interface NearbyMuseumCardProps extends CardProps {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	url: string;
	totalVisits: number;
	distance: number;
}

export function NearbyMuseumCard({
	name,
	address,
	postalCode,
	city,
	url,
	totalVisits,
	distance,
	...props
}: NearbyMuseumCardProps) {
	return (
		<Card
			{...props}
			variant="outlined"
			sx={{ display: 'flex', p: 3, ...props.sx }}
		>
			<img src="/vite.svg" alt="museum" loading="lazy" />
			<Box ml={2} flexGrow={1}>
				<Typography fontWeight={500} textTransform="capitalize" gutterBottom>
					{name}
				</Typography>
				<Typography>{address}</Typography>
				<Typography gutterBottom>
					{postalCode} {city}
				</Typography>
				<Link color="text.secondary" href={url}>
					{url}
				</Link>
			</Box>
			<Box flexShrink={0} flexBasis={55} ml={3}>
				<Typography variant="body2">{distance} km</Typography>
				<Typography variant="body2">{totalVisits} visites</Typography>
			</Box>
		</Card>
	);
}
