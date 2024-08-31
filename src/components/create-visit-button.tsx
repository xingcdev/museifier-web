import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { CreateVisitFormDialog } from './create-visit-form-dialog';

export function CreateVisitButton() {
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<Button
				variant="contained"
				size="small"
				onClick={() => setOpenDialog(true)}
				startIcon={<AddCircleOutlineOutlinedIcon />}
			>
				Create
			</Button>
			{openDialog && (
				<CreateVisitFormDialog
					open={openDialog}
					onClose={() => setOpenDialog(false)}
				/>
			)}
		</>
	);
}
