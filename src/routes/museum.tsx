import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMuseum } from '../api/museum/get-museum';
import { CreateMuseumVisitFormDialog } from '../components/create-museum-visit-form-dialog';
import { MuseumVisits } from '../components/museum-visits';
import { Page } from '../components/ui/page';
import { StringUtils } from '../utils/string-utils';

export function Museum() {
	const params = useParams();
	const museumId = params.museumId || '';
	const { data } = useQuery({
		queryKey: ['museum'],
		queryFn: () => getMuseum(museumId),
		enabled: !!museumId,
	});
	const queryClient = useQueryClient();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	if (!data) {
		return null;
	}

	return (
		<Page sx={{ minHeight: '80vh' }}>
			<Stack spacing={2}>
				<Typography
					variant="h5"
					component="h1"
					fontWeight={500}
					textTransform="capitalize"
					gutterBottom
				>
					{data.name}
				</Typography>

				<Box>
					<Typography>{data.address}</Typography>
					<Typography>
						{data.postalCode} {data.city}
					</Typography>
					<Typography gutterBottom>{data.department}</Typography>
				</Box>
				<Stack spacing={0.5}>
					{data.phoneNumber && (
						<Box display="flex" alignItems="center">
							<LocalPhoneIcon fontSize="small" sx={{ mr: 1 }} />
							<Typography>{data.phoneNumber}</Typography>
						</Box>
					)}

					{data.url && (
						<Box display="flex" alignItems="center">
							<LanguageIcon fontSize="small" sx={{ mr: 1 }} />
							<Link href={data.url}>{StringUtils.truncate(data.url, 60)}</Link>
						</Box>
					)}
				</Stack>
			</Stack>

			<Box py={4}>
				<MuseumVisits visits={data.visits} />
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
						museumId={data.id}
						museumName={data.name}
						open={openCreateDialog}
						onClose={() => setOpenCreateDialog(false)}
						onSuccess={() =>
							queryClient.invalidateQueries({ queryKey: ['museum'] })
						}
					/>
				)}
			</Box>
		</Page>
	);
}
