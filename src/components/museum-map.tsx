import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import L, {
	LatLngExpression,
	Map,
	type DivIcon,
	type Marker as MarkerType,
} from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	type PopupProps,
} from 'react-leaflet';
import { getNearbyMuseums } from '../api/museum/get-nearby-museums';
import { AddressAutocomplete } from './address-autocomplete';
import { CreateVisitButton } from './create-visit-button';
import { NearbyMuseumCard } from './nearby-museum-card';
import { GetStarted } from './ui/placeholder/get-started';
import { NoSearchResultsFound } from './ui/placeholder/no-search-results-found';

const parisLocation: LatLngExpression = [48.8566, 2.3522];

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

const MarkerIcon = (
	number: number,
	isHighlighted: boolean = false
): DivIcon => {
	const theme = useTheme();
	const color = isHighlighted
		? theme.palette.secondary.main
		: theme.palette.primary.main;
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
	const mapRef = useRef<Map>(null);
	const popupRefs = useRef<MarkerType[]>([]);
	const [hoveredMarker, setHoveredMarker] = useState('');
	const [selectedMarker, setSelectedMarker] = useState('');

	const [searchTerm, setSearchTerm] = useState('');
	const [enableSearch, setEnableSearch] = useState(false);
	const [currentLocation, setCurrentLocation] =
		useState<LatLngExpression>(parisLocation);

	const { data } = useQuery({
		queryKey: ['get-nearby-museums'],
		queryFn: () => getNearbyMuseums(searchTerm),
		enabled: enableSearch,
	});

	function setView(lat: number, lon: number) {
		if (mapRef.current) {
			mapRef.current.setView([lat, lon]);
		}
	}

	useEffect(() => {
		if (enableSearch && data) {
			setCurrentLocation([data.latitude, data.longitude]);
			setEnableSearch(false);
			setView(data.latitude, data.longitude);
		}
	}, [data, enableSearch]);

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

					<AddressAutocomplete
						inputValue={searchTerm}
						onInputChange={(_, newValue) => setSearchTerm(newValue)}
						sx={{ my: 4 }}
						onSearch={() => setEnableSearch(true)}
					/>
					{data && data.totalResults > 0 ? (
						<>
							<Typography gutterBottom>
								{data.totalResults} résultats à proximité de "{data.query}"
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
											url={museum.url}
											totalVisits={museum.totalVisits}
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
					) : searchTerm ? (
						<NoSearchResultsFound>
							Nous avons trouvé aucun musée à proximité.
						</NoSearchResultsFound>
					) : (
						<GetStarted>
							Saisir une adresse dans la barre de recherche.
						</GetStarted>
					)}
				</Box>
				<MapContainer
					ref={mapRef}
					center={currentLocation}
					zoom={13}
					style={{ height: '100%', flexGrow: 1 }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{data && data.data.length > 0
						? data.data.map((museum, index) => (
								<Marker
									key={museum.id}
									position={[museum.latitude, museum.longitude]}
									icon={
										selectedMarker === museum.id
											? MarkerIcon(museum.totalVisits, true)
											: hoveredMarker === museum.id
											? MarkerIcon(museum.totalVisits, true)
											: MarkerIcon(museum.totalVisits)
									}
									eventHandlers={{
										click: () => setSelectedMarker(museum.id),
										mouseover: () => setHoveredMarker(museum.id),
										mouseout: () => setHoveredMarker(''),
									}}
									ref={(ref) => (popupRefs.current[index] = ref as MarkerType)}
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

											<Link href={museum.url} sx={{ marginBottom: 1.5 }}>
												{museum.url}
											</Link>
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
											<CreateVisitButton variant="outlined" color="info">
												Créer une visite
											</CreateVisitButton>
											<Button variant="outlined" color="info" size="small">
												Voir les visites
											</Button>
										</Stack>
									</StyledPopup>
								</Marker>
						  ))
						: 'no museums'}
				</MapContainer>
			</Box>
		</>
	);
}
