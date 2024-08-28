import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	getVisitedMuseums,
	type GetVisitedMuseumsParams,
} from '../api/museum/get-visited-museums';
import { AddVisitFormDialog } from './add-visit-form-dialog';
import { MuseumCard } from './museum-card';
import { MuseumVisits } from './museum-visits';
import { Search } from './ui/search';

export function VisitsList() {
	const [selectedMuseumId, setSelectedMuseumId] = useState('');

	const [searchParams, setSearchParams] = useSearchParams();
	const pageParam = searchParams.get('page');
	const page = pageParam ? parseInt(pageParam) : 1;
	const sizeParam = searchParams.get('size');
	const size = sizeParam ? parseInt(sizeParam) : 20;
	const searchQueryParam = searchParams.get('q');

	// e.g. ['name', 'asc']
	const sortParams = searchParams.get('sort')?.split(':') || [];
	const sortField = sortParams[0] ? sortParams[0] : 'name';
	const sortOrder = sortParams[1] ? sortParams[1] : 'asc';

	const getVisitedMuseumsParams: GetVisitedMuseumsParams = {
		page,
		size,
		q: searchQueryParam || undefined,
		sort: sortField && sortOrder ? sortField + ':' + sortOrder : undefined,
		city: searchParams.get('city') || undefined,
		postalCode: searchParams.get('postalCode') || undefined,
		department: searchParams.get('department') || undefined,
	};

	const { isPending, isError, error, data } = useQuery({
		queryKey: ['visitedMuseums', getVisitedMuseumsParams],
		queryFn: () => getVisitedMuseums(getVisitedMuseumsParams),
		placeholderData: keepPreviousData,
	});

	// ====== Sorting ======
	function handleSortField(e: SelectChangeEvent) {
		if (e.target.value) {
			const newValue = `${e.target.value}:${sortOrder}`;
			searchParams.set('sort', newValue);
		} else {
			searchParams.delete('sort');
		}
		setSearchParams(searchParams);
	}

	function handleSortOrder() {
		if (sortOrder === 'asc') {
			const newValue = `${sortField}:desc`;
			searchParams.set('sort', newValue);
		} else {
			const newValue = `${sortField}:asc`;
			searchParams.set('sort', newValue);
		}
		setSearchParams(searchParams);
	}
	// ====================

	function handleSearch(e: any) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const query = formData.get('query')?.toString();
		if (query) {
			searchParams.set('q', query);
			setSearchParams(searchParams);
		} else {
			searchParams.delete('q');
			setSearchParams(searchParams);
		}
	}

	const selectedMuseum =
		data?.data.find((museum) => museum.id === selectedMuseumId) || null;

	// Initial museum id
	useEffect(() => {
		if (data && data.data.length > 0 && !selectedMuseum) {
			setSelectedMuseumId(data.data[0].id);
		}
	}, [data, selectedMuseum]);

	// If we change the pagination, sorting, filtering, select the first museum in the list.
	useEffect(() => {
		if (data && data.data.length > 0 && selectedMuseum) {
			setSelectedMuseumId(data.data[0].id);
		}
	}, [data, searchParams]);

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
			<Stack
				justifyContent="space-between"
				alignItems="center"
				direction="row"
				pb={2}
			>
				<Typography variant="h5" component="h1">
					My visits
				</Typography>
				{(data.data.length > 0 || searchQueryParam) && (
					<Stack direction="row" spacing={2}>
						<form onSubmit={handleSearch}>
							<Search
								name="query"
								defaultValue={searchParams.get('q')?.toString()}
							/>
						</form>
						<Stack direction="row" spacing={0.5}>
							<Select
								defaultValue={sortField || 'name'}
								onChange={handleSortField}
								size="small"
								sx={{
									width: 90,
									borderRadius: 10,
								}}
							>
								<MenuItem value="name">Name</MenuItem>
								<MenuItem value="city">City</MenuItem>
							</Select>
							<IconButton
								aria-label="sort"
								size="small"
								onClick={handleSortOrder}
							>
								{sortOrder === 'desc' ? (
									<ArrowDownwardIcon />
								) : (
									<ArrowUpwardIcon />
								)}
							</IconButton>
						</Stack>

						<Button
							variant="contained"
							size="small"
							onClick={handleClickOpen}
							startIcon={<AddCircleOutlineOutlinedIcon />}
						>
							Create
						</Button>
					</Stack>
				)}
			</Stack>
			<AddVisitFormDialog
				open={openDialog}
				onClose={handleClose}
				onCancel={handleClose}
			/>
			{data.data.length > 0 ? (
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
								// onChange={(_, value) => setPage(value)}
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
			) : searchQueryParam ? (
				<NoSearchResultsFound />
			) : (
				<Box display="flex" justifyContent="center" alignItems="center" py={10}>
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
			)}
		</>
	);
}

function NoSearchResultsFound() {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" py={10}>
			<Box textAlign="center">
				<Typography variant="subtitle1" mb={3}>
					No results are found, please try different keywords.
				</Typography>
			</Box>
		</Box>
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
