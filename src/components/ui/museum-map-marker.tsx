import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { type Marker as MarkerType } from 'leaflet';
import { forwardRef, useState, type Ref } from 'react';
import {
	Marker,
	Popup,
	type MarkerProps,
	type PopupProps,
} from 'react-leaflet';
import { StringUtils } from '../../utils/string-utils';
import { CreateMuseumVisitFormDialog } from '../create-museum-visit-form-dialog';

const StyledPopup = styled(Popup)<PopupProps>(({ theme }) => ({
	width: 360,
	'& .leaflet-popup-content': {
		width: '360px !important',
		margin: 0,
		padding: theme.spacing(2),
	},
	'& .leaflet-popup-content p': {
		margin: 0,
	},
}));

interface MuseumMapMarkerProps extends MarkerProps {
	museum: {
		id: string;
		name: string;
		address: string;
		postalCode: string;
		city: string;
		department: string;
		phoneNumber: string;
		url: string | null;
		totalVisits: number;
	};
}

export const MuseumMapMarker = forwardRef(
	({ museum, ...props }: MuseumMapMarkerProps, ref: Ref<MarkerType>) => {
		return (
			<Marker {...props} ref={ref}>
				<StyledPopup>
					<Stack marginBottom={2.5} spacing={1}>
						<Typography
							fontWeight={500}
							textTransform="capitalize"
							sx={{
								mb: (t) => `${t.spacing(1)} !important`,
							}}
						>
							{museum.name}
						</Typography>

						<Typography>
							{museum.address} {museum.postalCode} {museum.city}
						</Typography>
						<Box display="flex" alignItems="center">
							<LocalPhoneIcon fontSize="small" sx={{ mr: 1 }} />
							<Typography>{museum.phoneNumber}</Typography>
						</Box>

						{museum.url && (
							<Box display="flex" alignItems="center">
								<LanguageIcon fontSize="small" sx={{ mr: 1 }} />
								<Link href={museum.url}>
									{StringUtils.truncate(museum.url, 60)}
								</Link>
							</Box>
						)}
					</Stack>

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

					<Stack direction="row" spacing={2} mt={1}>
						<CreateMuseumVisitButton
							museumId={museum.id}
							museumName={museum.name}
						/>
						{museum.totalVisits ? (
							<Button
								variant="outlined"
								color="info"
								size="small"
								href={`/museums/${museum.id}`}
							>
								Voir les visites
							</Button>
						) : null}
					</Stack>
				</StyledPopup>
			</Marker>
		);
	}
);

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
					onSuccess={() =>
						queryClient.invalidateQueries({ queryKey: ['get-nearby-museums'] })
					}
					onClose={() => setOpenDialog(false)}
				/>
			)}
		</>
	);
}
