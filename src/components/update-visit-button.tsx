import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { useState } from 'react';
import { UpdateVisitDialog } from './update-visit-dialog';

export interface UpdateVisitButtonProps extends IconButtonProps {
	id: string;
	initialValues?: {
		title: string;
		comment: string;
	};
}

export function UpdateVisitButton({
	id,
	initialValues,
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
				/>
			)}
		</>
	);
}
