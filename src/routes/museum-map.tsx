import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import L, {
	latLng,
	Map,
	type DivIcon,
	type LatLngTuple,
	type Marker as MarkerType,
} from 'leaflet';
import { useMemo, useRef, useState } from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvent,
	type PopupProps,
} from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import { geocode } from '../api/geocoding/geocode';
import { getAddressAutocompletion } from '../api/geocoding/get-address-autocompletion';
import { getNearbyMuseums } from '../api/museum/get-nearby-museums';
import { AddressAutocomplete } from '../components/address-autocomplete';
import { CreateMuseumVisitFormDialog } from '../components/create-museum-visit-form-dialog';
import { NearbyMuseumCard } from '../components/nearby-museum-card';
import { SomethingIsWrong } from '../components/ui/errors/something-is-wrong';
import { Loading } from '../components/ui/loading';
import { GetStarted } from '../components/ui/placeholder/get-started';
import { NoSearchResultsFound } from '../components/ui/placeholder/no-search-results-found';
import { StringUtils } from '../utils/string-utils';

const PARIS_LOCATION: LatLngTuple = [48.8566, 2.3522];

const StyledPopup = styled(Popup)<PopupProps>(({ theme }) => ({
	width: 360,
	'& .leaflet-popup-content': {
		width: '360px !important',
		margin: 0,
		padding: theme.spacing(2),
	},
	'& .leaflet-popup-content p': {
		marginBottom: theme.spacing(1),
		marginTop: 0,
	},
}));

const createMarkerIcon = (number: number, color: string): DivIcon => {
	const badgeClass = number ? 'museum-map-marker__badge' : 'hidden';

	return L.divIcon({
		html: `
      <div class="museum-map-marker">
	  <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill=${color}><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <div class=${badgeClass}>${number}</div>
      </div>
    `,
		className: '', // Ensure no default Leaflet styles are applied
		iconSize: [48, 48], // Set the icon size
		shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
		shadowSize: [41, 41],
		iconAnchor: [15, 42], // Anchor to the bottom center
		popupAnchor: [0, -40], // Anchor the popup to the top of the marker
	});
};

export function MuseumMap() {
	const theme = useTheme();
	const mapRef = useRef<Map>(null);
	const popupRefs = useRef<MarkerType[]>([]);
	const [hoveredMarker, setHoveredMarker] = useState('');
	const [selectedMarker, setSelectedMarker] = useState('');

	const [searchParams, setSearchParams] = useSearchParams();
	const addressParam = useMemo(
		() => searchParams.get('q') || '',
		[searchParams]
	);
	const currentLocation = useMemo(
		() =>
			searchParams
				.get('location')
				?.split(',')
				.map((location) => parseFloat(location)) || null,
		[searchParams]
	);

	const [autocompleteValue, setAutocompleteValue] = useState<string | null>(
		null
	);

	//  ====== 1. Initialization of auto complete ======
	// Logic: <Autocomplete /> changes the 'q' search param --> perform the geocoding--> update 'location' search param --> perform nearby museums request

	useQuery({
		queryKey: ['init-address-autocompletion'],
		queryFn: async () => {
			const data = await getAddressAutocompletion(addressParam, 1);
			if (data) {
				const firstAddress = data.features[0].properties.label;
				setAutocompleteValue(firstAddress);
				searchParams.set('q', firstAddress);
				setSearchParams(searchParams);
			}
			return data;
		},
		retry: false,
	});

	//  ====== 2. Geocode the address ======
	// When the search param 'q' changes, this geocoding query is performed

	useQuery({
		queryKey: ['geocode', addressParam],
		queryFn: async () => {
			const data = await geocode(addressParam);
			if (data && data.length == 2) {
				searchParams.set('location', `${data[1]},${data[0]}`);
				setSearchParams(searchParams);
			}
			return data;
		},
		enabled: !!addressParam,
	});

	//  ====== Autocomplete search ======

	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

	const {
		data: addressAutoCompletion,
		isPending: addressAutoCompletionLoading,
	} = useQuery({
		queryKey: ['address-autocompletion', debouncedSearchTerm],
		queryFn: () => getAddressAutocompletion(debouncedSearchTerm),
		select: (data) => data.features.map((feature) => feature.properties.label),
		enabled: debouncedSearchTerm.length >= 5,
	});

	// ====================================

	const { data, isPending, isFetching, isError } = useQuery({
		queryKey: ['get-nearby-museums', currentLocation],
		queryFn: async () => {
			if (currentLocation) {
				const data = await getNearbyMuseums(
					currentLocation[0],
					currentLocation[1]
				);
				if (mapRef.current && data.data) {
					mapRef.current.setView([currentLocation[0], currentLocation[1]]);
				}
				return data;
			}
			return;
		},
		// Do not fetch at the initial load
		enabled: !!currentLocation,
	});

	function DisableSelectedMarker() {
		useMapEvent('click', () => {
			if (selectedMarker) {
				setSelectedMarker('');
			}
		});
		return null;
	}

	function handleAutocompleteSearch() {
		if (autocompleteValue) {
			searchParams.set('q', autocompleteValue);
		} else {
			searchParams.delete('q');
			searchParams.delete('location');
		}
		setSearchParams(searchParams);
	}

	function getMyLocation() {
		if (!navigator.geolocation) {
			return;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude } = position.coords;
			searchParams.set('location', `${latitude},${longitude}`);
			searchParams.delete('q');
			setSearchParams(searchParams);
			setAutocompleteValue(null);
		});
	}

	return (
		<>
			<Box display="flex" height="91vh">
				<Box p={4} height="100%" overflow="auto" flexBasis={550}>
					<Typography variant="h5" component="h1" gutterBottom>
						Découvrir les musées
					</Typography>
					<Typography variant="subtitle1" component="p">
						Trouvez facilement les musées les plus proches de chez vous
					</Typography>

					<Stack direction="row" spacing={2} my={4}>
						<AddressAutocomplete
							inputValue={searchTerm}
							onInputChange={(_, newValue) => {
								setSearchTerm(newValue);
							}}
							value={autocompleteValue}
							onChange={(_, newValue) => {
								setAutocompleteValue(newValue);
							}}
							loading={searchTerm.length > 5 && addressAutoCompletionLoading}
							options={addressAutoCompletion || []}
							sx={{ flexGrow: 1 }}
							onSearch={handleAutocompleteSearch}
						/>
						<Tooltip title="Se géolocaliser">
							<IconButton onClick={getMyLocation}>
								<MyLocationIcon />
							</IconButton>
						</Tooltip>
					</Stack>
					{isError ? (
						<SomethingIsWrong />
					) : data && data.totalResults > 0 ? (
						<>
							<Typography gutterBottom>
								{data.totalResults} résultats à proximité de "
								{addressParam ? addressParam : 'Ma position'}"
							</Typography>
							<Stack spacing={2}>
								{data.data.map((museum, index) => (
									<Box
										key={museum.id}
										onClick={() => {
											setSelectedMarker(museum.id);
											popupRefs.current[index]?.openPopup();
										}}
										sx={{
											cursor: 'pointer',
										}}
									>
										<NearbyMuseumCard
											name={museum.name}
											address={museum.address}
											postalCode={museum.postalCode}
											city={museum.city}
											url={museum.url || ''}
											totalVisits={museum.totalVisits}
											distance={museum.distance}
											onMouseEnter={() => setHoveredMarker(museum.id)}
											onMouseLeave={() => setHoveredMarker('')}
											sx={{
												'&:hover': {
													outline: 1.5,
													outlineColor: 'primary.main',
												},
												outline: selectedMarker === museum.id ? 1.5 : undefined,
												outlineColor:
													selectedMarker === museum.id
														? 'primary.main'
														: undefined,
											}}
										/>
									</Box>
								))}
							</Stack>
						</>
					) : isFetching ? (
						<Loading />
					) : isPending ? (
						<GetStarted>
							Saisir une adresse dans la barre de recherche.
						</GetStarted>
					) : (
						<NoSearchResultsFound>
							Nous avons trouvé aucun musée à proximité.
						</NoSearchResultsFound>
					)}
				</Box>
				<MapContainer
					ref={mapRef}
					center={
						currentLocation
							? latLng(currentLocation[0], currentLocation[1])
							: PARIS_LOCATION
					}
					zoom={13}
					style={{ height: '100%', flexGrow: 1 }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<DisableSelectedMarker />

					{data && data.data.length > 0
						? data.data.map((museum, index) => {
								const defaultMarkerIcon = createMarkerIcon(
									museum.totalVisits,
									theme.palette.primary.main
								);

								const highlightedMarkerIcon = createMarkerIcon(
									museum.totalVisits,
									theme.palette.secondary.main
								);

								return (
									<Marker
										key={museum.id}
										position={[museum.latitude, museum.longitude]}
										icon={
											selectedMarker === museum.id
												? highlightedMarkerIcon
												: hoveredMarker === museum.id
												? highlightedMarkerIcon
												: defaultMarkerIcon
										}
										eventHandlers={{
											click: () => setSelectedMarker(museum.id),
											mouseover: () => setHoveredMarker(museum.id),
											mouseout: () => setHoveredMarker(''),
										}}
										ref={(ref) =>
											(popupRefs.current[index] = ref as MarkerType)
										}
									>
										<StyledPopup>
											<Box marginBottom={2.5}>
												<Typography
													fontWeight={500}
													textTransform="capitalize"
													marginBottom={2}
												>
													{museum.name}
												</Typography>
												<Typography>
													{museum.address} {museum.postalCode} {museum.city}
												</Typography>

												{museum.url && (
													<Link href={museum.url} sx={{ marginBottom: 1.5 }}>
														{StringUtils.truncate(museum.url, 60)}
													</Link>
												)}
											</Box>

											{museum.totalVisits ? (
												<Typography color="text.secondary" variant="body2">
													Vous avez visité{' '}
													<Typography
														color="primary"
														component="span"
														fontWeight={500}
														variant="body2"
													>
														{museum.totalVisits}
													</Typography>{' '}
													fois ce musée.
												</Typography>
											) : (
												<Typography color="text.secondary" variant="body2">
													Vous n'avez pas encore visité ce musée.
												</Typography>
											)}

											<Stack direction="row" spacing={2}>
												<CreateMuseumVisitButton
													museumId={museum.id}
													museumName={museum.name}
												/>
												{museum.totalVisits ? (
													<Button
														variant="outlined"
														color="info"
														size="small"
														href={`/visits?id=${museum.id}`}
													>
														Voir les visites
													</Button>
												) : null}
											</Stack>
										</StyledPopup>
									</Marker>
								);
						  })
						: 'no museums'}
				</MapContainer>
			</Box>
		</>
	);
}

interface CreateMuseumVisitButtonProps extends ButtonProps {
	museumId: string;
	museumName: string;
}

function CreateMuseumVisitButton({
	museumId,
	museumName,
	...props
}: CreateMuseumVisitButtonProps) {
	const queryClient = useQueryClient();

	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<Button
				size="small"
				variant="outlined"
				color="info"
				onClick={() => setOpenDialog(true)}
				startIcon={<AddCircleOutlineOutlinedIcon />}
				{...props}
			>
				Créer une visite
			</Button>
			{openDialog && (
				<CreateMuseumVisitFormDialog
					museumId={museumId}
					museumName={museumName}
					open={openDialog}
					onQuerySuccess={() =>
						queryClient.invalidateQueries({ queryKey: ['get-nearby-museums'] })
					}
					onClose={() => setOpenDialog(false)}
				/>
			)}
		</>
	);
}
