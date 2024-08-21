import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getVisits } from '../api/visit/get-visits';
import { AddVisitFormDialog } from './add-visit-form-dialog';
import { VisitCard } from './visit-card';

export function VisitsList() {
	const [page, setPage] = useState(1);
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['visits'],
		queryFn: () => getVisits(page),
		placeholderData: keepPreviousData,
	});

	const [openDialog, setOpenDialog] = useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<>
			<Stack
				justifyContent="space-between"
				direction="row"
				borderBottom={1}
				borderColor="divider"
				pb={2}
			>
				<Typography variant="h5" component="h1">
					My visits
				</Typography>
				{data.data.length > 0 && (
					<Button
						variant="contained"
						size="small"
						onClick={handleClickOpen}
						startIcon={<AddCircleOutlineOutlinedIcon />}
					>
						Create
					</Button>
				)}
			</Stack>
			<AddVisitFormDialog
				open={openDialog}
				onClose={handleClose}
				onCancel={handleClose}
			/>
			{data.data.length > 0 ? (
				<>
					<List>
						{data.data.map((visit) => (
							<VisitCard
								key={visit.id}
								visitId={visit.id}
								comment={visit.comment}
								museum={{
									name: visit.museum.name,
									address: visit.museum.address,
									postalCode: visit.museum.postalCode,
									city: visit.museum.city,
									url: visit.museum.url,
								}}
							/>
						))}
					</List>
					<Box display="flex" justifyContent="flex-end" py={1}>
						<Pagination
							count={data.pageInfo.totalPages}
							variant="outlined"
							shape="rounded"
							page={page}
							onChange={(_, value) => setPage(value)}
						/>
					</Box>
				</>
			) : (
				<>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						py={10}
					>
						<Box textAlign="center">
							<SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 100 }} />
							<Typography variant="subtitle1" mb={3}>
								It seems that you don't have any visits.
							</Typography>
							<Button variant="contained" onClick={handleClickOpen}>
								Add a visit
							</Button>
						</Box>
					</Box>
				</>
			)}
		</>
	);
}
