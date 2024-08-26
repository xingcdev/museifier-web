import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getVisitedMuseums } from '../api/museum/get-visited-museums';
import { AddVisitFormDialog } from './add-visit-form-dialog';
import { MuseumCard } from './museum-card';
import { MuseumVisits } from './museum-visits';

export function VisitsList() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState('name:asc');
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['visitedMuseums'],
		queryFn: () => getVisitedMuseums(page, pageSize, sort),
		placeholderData: keepPreviousData,
	});
	const [selectedMuseumId, setSelectedMuseumId] = useState('');

	// Initial museum id
	useEffect(() => {
		if (data && !selectedMuseum) {
			setSelectedMuseumId(data.data[0].id);
		}
	}, [data]);

	const selectedMuseum =
		data?.data.find((museum) => museum.id === selectedMuseumId) || null;

	const [openDialog, setOpenDialog] = useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	if (isPending) {
		return <SkeletonScreen />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<>
			<Stack justifyContent="space-between" direction="row" pb={2}>
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
					<Box display="flex">
						<Box>
							<Stack
								spacing={2}
								sx={{
									flexBasis: 417,
								}}
							>
								{data.data.map((museum) => (
									<Box
										key={museum.id}
										onClick={() => setSelectedMuseumId(museum.id)}
										sx={{
											cursor: 'pointer',
										}}
									>
										<MuseumCard
											name={museum.name}
											address={museum.address}
											postalCode={museum.postalCode}
											city={museum.city}
											url={museum.url}
											sx={{
												borderColor:
													selectedMuseumId === museum.id
														? 'primary.main'
														: undefined,
											}}
										/>
									</Box>
								))}
							</Stack>
							<Box display="flex" justifyContent="flex-end" py={1}>
								<Pagination
									count={data.pageInfo.totalPages}
									variant="outlined"
									shape="rounded"
									page={page}
									onChange={(_, value) => setPage(value)}
								/>
							</Box>
						</Box>

						<MuseumVisits
							visits={selectedMuseum?.visits || []}
							sx={{
								flexBasis: 0,
								flexGrow: 1,
								ml: 3,
								p: 2,
								position: 'sticky',
								height: '93vh',
								overflow: 'scroll',
								top: 12,
							}}
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

function SkeletonScreen() {
	return (
		<>
			<Skeleton height={50} variant="rectangular" sx={{ mb: 4 }} />
			{[1, 2, 3, 4].map((value) => (
				<Skeleton
					key={value}
					variant="rectangular"
					height={140}
					sx={{ mb: 5 }}
				/>
			))}
		</>
	);
}
