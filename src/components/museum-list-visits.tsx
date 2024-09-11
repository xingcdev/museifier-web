import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card, { type CardProps } from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CreateMuseumVisitFormDialog } from './create-museum-visit-form-dialog';
import { DeleteVisitButton } from './delete-visit-button';
import { UpdateVisitButton } from './update-visit-button';

interface MuseumListVisitsProps extends CardProps {
	museumId: string;
	museumName: string;
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

export function MuseumListVisits({
	visits,
	museumId,
	museumName,
	...props
}: MuseumListVisitsProps) {
	const [editMode, setEditMode] = useState(false);
	const queryClient = useQueryClient();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	return (
		<Card {...props} variant="outlined">
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				px={0.5}
				py={1.5}
			>
				<Typography color="text.secondary">
					<Typography component="span" fontWeight={500}>
						{visits.length}
					</Typography>{' '}
					total {visits.length > 1 ? 'visits' : 'visit'}
				</Typography>
				<FormControlLabel
					control={
						<Switch
							size="small"
							checked={editMode}
							onChange={(e) => setEditMode(e.target.checked)}
						/>
					}
					label="Edit mode"
					slotProps={{
						typography: {
							fontWeight: 500,
						},
					}}
				/>
			</Stack>
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
							height={30}
						>
							<Rating value={visit.rating} readOnly />
							<Stack direction="row" alignItems="center" spacing={1}>
								<Typography>
									{dayjs().diff(dayjs(visit.created), 'day') > 7
										? dayjs(visit.created).format('MMMM DD, YYYY')
										: dayjs(visit.created).fromNow()}
								</Typography>
								{editMode && (
									<Stack direction="row" alignItems="center">
										<UpdateVisitButton
											id={visit.id}
											initialValues={{
												title: visit.title,
												comment: visit.comment,
											}}
											onSuccess={() =>
												queryClient.invalidateQueries({
													queryKey: ['visitedMuseums'],
												})
											}
										/>
										<DeleteVisitButton
											id={visit.id}
											visitName={visit.title}
											size="small"
											color="primary"
											onSuccess={() =>
												queryClient.invalidateQueries({
													queryKey: ['visitedMuseums'],
												})
											}
										/>
									</Stack>
								)}
							</Stack>
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
								<EditNoteIcon fontSize="medium" color="action" />
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
			<Box display="flex" justifyContent="center" alignItems="center" py={2}>
				<Button
					variant="contained"
					size="small"
					startIcon={<AddCircleOutlineIcon />}
					onClick={() => setOpenCreateDialog(true)}
				>
					Créer
				</Button>
			</Box>
			{openCreateDialog && (
				<CreateMuseumVisitFormDialog
					museumId={museumId}
					museumName={museumName}
					open={openCreateDialog}
					onClose={() => setOpenCreateDialog(false)}
					onSuccess={() =>
						queryClient.invalidateQueries({ queryKey: ['visitedMuseums'] })
					}
				/>
			)}
		</Card>
	);
}
