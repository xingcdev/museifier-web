import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Button, { type ButtonProps } from '@mui/material/Button';
import { useState } from 'react';
import { CreateVisitFormDialog } from './create-visit-form-dialog';
import type { VisitDto } from '../api/dtos/visitDto';

interface CreateVisitButtonProps extends ButtonProps {
	onSuccess?: (data: VisitDto) => void;
}

export function CreateVisitButton({
	children,
	onSuccess,
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
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
}
