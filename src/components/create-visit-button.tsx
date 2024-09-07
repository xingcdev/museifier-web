import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Button, { type ButtonProps } from '@mui/material/Button';
import { useState } from 'react';
import { CreateVisitFormDialog } from './create-visit-form-dialog';

type CreateVisitButtonProps = ButtonProps;

export function CreateVisitButton({
	children,
	...props
}: CreateVisitButtonProps) {
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<Button
				variant="contained"
				size="small"
				onClick={() => setOpenDialog(true)}
				startIcon={<AddCircleOutlineOutlinedIcon />}
				{...props}
			>
				{children ? children : 'Créer'}
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
