import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getNearbyMuseums } from '../api/museum/get-nearby-museums';
import { AddressAutocomplete } from './address-autocomplete';
import { CreateVisitButton } from './create-visit-button';
import { MuseumCard } from './museum-card';

const parisLocation: LatLngExpression = [48.8566, 2.3522];

export function MuseumMap() {
	const [searchTerm, setSearchTerm] = useState('');
	const [enableSearch, setEnableSearch] = useState(false);
	const [currentLocation, setCurrentLocation] =
		useState<LatLngExpression>(parisLocation);

	const { data } = useQuery({
		queryKey: ['get-nearby-museums', searchTerm, 1],
		queryFn: () => getNearbyMuseums(searchTerm),
		enabled: enableSearch,
	});

	useEffect(() => {
		if (enableSearch && data) {
			setCurrentLocation([data.latitude, data.longitude]);
			setEnableSearch(false);
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
					<Stack spacing={2}>
						{data &&
							data.data.map((museum) => (
								<Box
									key={museum.id}
									// onClick={() => setSelectedMuseumId(museum.id)}
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
									/>
								</Box>
							))}
					</Stack>
				</Box>
				<MapContainer
					center={currentLocation}
					zoom={13}
					style={{ height: '100%', flexGrow: 1 }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{data && data.data.length > 0
						? data.data.map((museum) => (
								<Marker
									key={museum.id}
									position={[museum.latitude, museum.longitude]}
								>
									<Popup>
										{museum.name} <CreateVisitButton />
									</Popup>
								</Marker>
						  ))
						: 'no museums'}
				</MapContainer>
			</Box>
		</>
	);
}
