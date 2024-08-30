import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { type ReactNode } from 'react';

export interface ConfirmationDialogProps {
	title: string;
	open: boolean;
	onClose: () => void;
	onDelete: () => void;
	isLoading?: boolean;
	children: ReactNode;
}

export function DeleteConfirmDialog(props: ConfirmationDialogProps) {
	const { onClose, onDelete, open, isLoading, children, title, ...other } =
		props;

	const handleCancel = () => {
		onClose();
	};

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth="xs"
			open={open}
			onClose={onClose}
			{...other}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} variant="text">
					Cancel
				</Button>
				<LoadingButton
					onClick={onDelete}
					loading={isLoading}
					variant="contained"
					color="error"
				>
					Delete
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
