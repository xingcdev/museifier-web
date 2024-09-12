import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { VisitDto } from '../api/dtos/visitDto';
import { deleteVisit } from '../api/visit/delete-visit';
import { DeleteConfirmDialog } from './ui/delete-confirm-dialog';

export interface DeleteVisitButtonProps extends ButtonProps {
	id: string;
	visitName: string;
	onSuccess?: (data: VisitDto) => void;
}

export function DeleteVisitButton({
	id,
	visitName,
	onSuccess,
	...props
}: DeleteVisitButtonProps) {
	const { mutate } = useMutation({
		mutationFn: ({ id }: { id: string }) => deleteVisit(id),
	});
	const [openDialog, setOpenDialog] = useState(false);

	function handleClick() {
		mutate(
			{ id },
			{
				onSuccess: onSuccess ? onSuccess : undefined,
			}
		);
	}

	return (
		<>
			<IconButton
				{...props}
				aria-label="delete"
				onClick={() => setOpenDialog(true)}
			>
				<DeleteIcon fontSize={props.size} />
			</IconButton>
			<DeleteConfirmDialog
				title="Êtes-vous sûr ?"
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				onDelete={handleClick}
			>
				<Typography>
					Êtes-vous sûr de supprimer votre visite <b>{visitName}</b>
				</Typography>
			</DeleteConfirmDialog>
		</>
	);
}
