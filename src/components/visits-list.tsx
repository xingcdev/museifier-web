import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
	useEffect,
	useMemo,
	useState,
	type ChangeEvent,
	type FormEventHandler,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	getVisitedMuseums,
	type GetVisitedMuseumsParams,
} from '../api/museum/get-visited-museums';
import { CreateVisitButton } from './create-visit-button';
import { MuseumCard } from './museum-card';
import { MuseumVisits } from './museum-visits';
import { FilterButton } from './ui/filter-button';
import { Page } from './ui/page';
import { NoSearchResultsFound } from './ui/placeholder/no-search-results-found';
import { Search } from './ui/search';
import { VisitFilter } from './visit-filter';

export function VisitsList() {
	const [searchParams, setSearchParams] = useSearchParams();

	const selectedMuseumId = searchParams.get('id');

	function setSelectedMuseumId2(value: string) {
		searchParams.set('id', value);
		setSearchParams(searchParams);
	}

	// ====== Filtering ======
	const [openFilter, setOpenFilter] = useState(false);
	const [numberOfFilters, setNumberOfFilters] = useState(0);

	const pageParam = searchParams.get('page');
	const page = pageParam ? parseInt(pageParam) : 1;
	const sizeParam = searchParams.get('size');
	const size = sizeParam ? parseInt(sizeParam) : 15;
	const searchQueryParam = searchParams.get('q');
	const cityParam = searchParams.get('city');
	const postalCodeParam = searchParams.get('postalCode');
	const departmentParam = searchParams.get('department');
	const isFiltering = !!cityParam || !!postalCodeParam || !!departmentParam;

	// e.g. ['name', 'asc']
	const sortParams = searchParams.get('sort')?.split(':') || [];
	const sortField = sortParams[0] ? sortParams[0] : 'name';
	const sortOrder = sortParams[1] ? sortParams[1] : 'asc';
	const isSorting = sortParams.length > 0;

	const getVisitedMuseumsParams: GetVisitedMuseumsParams = {
		page,
		size,
		q: searchQueryParam || undefined,
		sort: sortField && sortOrder ? sortField + ':' + sortOrder : undefined,
		city: cityParam || undefined,
		postalCode: postalCodeParam || undefined,
		department: departmentParam || undefined,
	};

	const { isPending, isError, error, data } = useQuery({
		queryKey: ['visitedMuseums', getVisitedMuseumsParams],
		queryFn: async () => {
			const data = await getVisitedMuseums(getVisitedMuseumsParams);

			if (data && data.data.length > 0) {
				// select the first museum on the first loading
				if (!selectedMuseumId) {
					setSelectedMuseumId2(data.data[0].id);
					// Select the first museum when filtering
				} else if (isFiltering || isSorting) {
					setSelectedMuseumId2(data.data[0].id);
				}
			} else {
				// When the user has no visits
				searchParams.delete('id');
				setSearchParams(searchParams);
			}
			return data;
		},
		placeholderData: keepPreviousData,
	});

	// ====== Pagination ======

	function handlePagination(page: number) {
		if (page > 1) {
			searchParams.set('page', page.toString());
		} else {
			searchParams.delete('page');
		}
		setSearchParams(searchParams);
	}

	// ========================

	// ====== Sorting ======
	function handleSortField(e: SelectChangeEvent) {
		if (e.target.value) {
			const newValue = `${e.target.value}:${sortOrder}`;
			searchParams.set('sort', newValue);
		} else {
			searchParams.delete('sort');
		}
		// Default sorting param
		if (searchParams.get('sort') === 'name:asc') {
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
		// Default sorting param
		if (searchParams.get('sort') === 'name:asc') {
			searchParams.delete('sort');
		}
		setSearchParams(searchParams);
	}
	// ====================

	const handleSearch: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const query = formData.get('query')?.toString();
		if (query) {
			searchParams.set('q', query);
			setSearchParams(searchParams);
		} else {
			searchParams.delete('q');
			setSearchParams(searchParams);
		}
	};

	// ====== Filtering ======

	function handleFilter(e: ChangeEvent<HTMLInputElement>) {
		const inputName = e.target.name;

		if (inputName === 'city') {
			if (e.target.value) {
				searchParams.set('city', e.target.value);
			} else {
				searchParams.delete('city');
			}
		} else if (inputName === 'postalCode') {
			if (e.target.value) {
				searchParams.set('postalCode', e.target.value);
			} else {
				searchParams.delete('postalCode');
			}
		} else if (inputName === 'department') {
			if (e.target.value) {
				searchParams.set('department', e.target.value);
			} else {
				searchParams.delete('department');
			}
		}
		setSearchParams(searchParams);
	}

	useEffect(() => {
		function computeFilterQuantity() {
			let number = 0;
			if (cityParam) {
				number += 1;
			}
			if (postalCodeParam) {
				number += 1;
			}
			if (departmentParam) {
				number += 1;
			}
			return number;
		}
		setNumberOfFilters(computeFilterQuantity());
	}, [cityParam, departmentParam, postalCodeParam]);

	// =======================

	const selectedMuseum = useMemo(
		() => data?.data.find((museum) => museum.id === selectedMuseumId) || null,
		[data, selectedMuseumId]
	);

	if (isPending) {
		return <SkeletonScreen />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<Page>
			<Stack
				justifyContent="space-between"
				alignItems="center"
				direction="row"
				pb={3}
			>
				<Typography variant="h5" component="h1">
					My visited museums
				</Typography>
				{(data.data.length > 0 || searchQueryParam || isFiltering) && (
					<Stack direction="row" spacing={2}>
						<form onSubmit={handleSearch}>
							<Search
								name="query"
								defaultValue={searchParams.get('q')?.toString()}
							/>
						</form>

						<FilterButton
							onClick={() => setOpenFilter((prev) => !prev)}
							numberOfFilters={numberOfFilters}
						/>

						<CreateVisitButton />
					</Stack>
				)}
			</Stack>
			<Collapse in={openFilter}>
				<VisitFilter handleChange={handleFilter} />
			</Collapse>

			{data.data.length > 0 ? (
				<Box display="flex">
					<Box>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							pb={2}
						>
							<Stack direction="row" alignItems="center">
								<Typography mr={1}>Sort by:</Typography>
								<Select
									value={sortField || 'name'}
									onChange={handleSortField}
									size="small"
									sx={{
										width: 90,
										borderRadius: 10,
										height: 32,
										textAlign: 'center',
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
							<Typography color="text.secondary">
								<Typography component="span" fontWeight={500}>
									{data.pageInfo.totalResults}
								</Typography>{' '}
								{data.pageInfo.totalResults > 1 ? 'results' : 'result'}
							</Typography>
						</Stack>
						<Stack
							spacing={2}
							sx={{
								flexBasis: 417,
							}}
						>
							{data.data.map((museum) => (
								<Box
									key={museum.id}
									onClick={() => setSelectedMuseumId2(museum.id)}
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
											width: 390,
											outline: selectedMuseumId === museum.id ? 1.5 : undefined,
											outlineColor:
												selectedMuseumId === museum.id
													? 'primary.main'
													: undefined,
										}}
									/>
								</Box>
							))}
						</Stack>
						<Box display="flex" justifyContent="center" py={2}>
							<Pagination
								count={data.pageInfo.totalPages}
								variant="outlined"
								shape="rounded"
								page={page}
								onChange={(_, newPage) => handlePagination(newPage)}
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
			) : searchQueryParam || isFiltering ? (
				<NoSearchResultsFound>
					Aucun résultat n'a été trouvé, veuillez essayer d'autres mots-clés.
				</NoSearchResultsFound>
			) : (
				<>
					<NoSearchResultsFound>
						<Typography mb={2}>
							Il semblerait que vous n'ayez aucune visite.
						</Typography>
						<CreateVisitButton />
					</NoSearchResultsFound>
				</>
			)}
		</Page>
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
