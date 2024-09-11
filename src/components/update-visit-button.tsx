import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { useState } from 'react';
import { UpdateVisitDialog } from './update-visit-dialog';
import type { VisitDto } from '../api/dtos/visitDto';

export interface UpdateVisitButtonProps extends IconButtonProps {
	id: string;
	initialValues?: {
		title: string;
		comment: string;
	};
	onSuccess?: (data: VisitDto) => void;
}

export function UpdateVisitButton({
	id,
	initialValues,
	onSuccess,
	...props
}: UpdateVisitButtonProps) {
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<IconButton
				{...props}
				size="small"
				color="primary"
				onClick={() => setOpenDialog(true)}
			>
				<EditOutlinedIcon fontSize="small" />
			</IconButton>
			{/* we don't use 'open' to control the dialog because we want to update 'initialValues' */}
			{openDialog && (
				<UpdateVisitDialog
					visitId={id}
					initialValues={initialValues}
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
}
