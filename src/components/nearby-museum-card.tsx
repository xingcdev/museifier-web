import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { StringUtils } from '../utils/string-utils';

export interface NearbyMuseumCardProps extends CardProps {
	name: string;
	address: string;
	postalCode: string;
	city: string;
	department: string;
	phoneNumber: string;
	url: string | null;
	totalVisits: number;
	distance: number;
}

export function NearbyMuseumCard({
	name,
	address,
	postalCode,
	city,
	department,
	phoneNumber,
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
			<Box flexGrow={1}>
				<Typography fontWeight={500} textTransform="capitalize" gutterBottom>
					{name}
				</Typography>
				<Typography>{address}</Typography>
				<Typography>
					{postalCode} {city}
				</Typography>
				<Typography gutterBottom>{department}</Typography>

				{phoneNumber && (
					<Box display="flex" alignItems="center">
						<LocalPhoneIcon fontSize="small" sx={{ mr: 1 }} />
						<Typography>{phoneNumber}</Typography>
					</Box>
				)}

				{url && (
					<Box display="flex" alignItems="center">
						<LanguageIcon fontSize="small" sx={{ mr: 1 }} />
						<Link href={url}>{StringUtils.truncate(url, 60)}</Link>
					</Box>
				)}
			</Box>
			<Box flexShrink={0} flexBasis={55} ml={3}>
				<Typography variant="body2">{distance} km</Typography>
				<Typography variant="body2">{totalVisits} visites</Typography>
			</Box>
		</Card>
	);
}
