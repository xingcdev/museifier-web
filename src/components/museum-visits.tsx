import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Card, { type CardProps } from '@mui/material/Card';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

interface VisitDetailsProps extends CardProps {
	visits: {
		id: string;
		title: string;
		visitDate: string;
		rating: number;
		comment: string;
		created: string;
		updated: string;
	}[];
}

export function MuseumVisits({ visits, ...props }: VisitDetailsProps) {
	return (
		<Card {...props} variant="outlined">
			<Stack spacing={2}>
				{visits.map((visit) => (
					<Card
						key={visit.id}
						variant="outlined"
						sx={{ p: 2, bgcolor: 'grey.100' }}
					>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							mb={2}
						>
							<Rating value={visit.rating} readOnly />
							<Typography>
								{dayjs().diff(dayjs(visit.created), 'day') > 7
									? dayjs(visit.created).format('MMMM DD, YYYY')
									: dayjs(visit.created).fromNow()}
							</Typography>
						</Stack>
						<Typography variant="h6" component="p">
							{visit.title}
						</Typography>
						<Typography mb={2}>{visit.comment}</Typography>
						<Typography mb={1}>
							<Typography fontWeight={500} component="span">
								Date of experience:{' '}
							</Typography>
							<Typography component="span">
								{dayjs(visit.visitDate).format('MMMM DD, YYYY')}
							</Typography>
						</Typography>

						{/* Display the 'last edited' if 'created' date and 'updated' date are different */}
						{dayjs(visit.updated).diff(dayjs(visit.created)) !== 0 ? (
							<Stack direction="row" spacing={0.5} alignItems="center">
								<EditOutlinedIcon fontSize="small" />
								<Typography variant="body2" color="text.secondary">
									Last edited{' '}
									{dayjs().diff(dayjs(visit.updated), 'day') > 7
										? dayjs(visit.updated).format('MMMM DD, YYYY')
										: dayjs(visit.updated).fromNow()}
								</Typography>
							</Stack>
						) : null}
					</Card>
				))}
			</Stack>
		</Card>
	);
}
