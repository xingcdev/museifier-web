import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteVisit } from '../api/visit/delete-visit';
import { DeleteConfirmDialog } from './ui/delete-confirm-dialog';

export interface DeleteVisitButtonProps extends ButtonProps {
	id: string;
	visitName: string;
}

export function DeleteVisitButton({
	id,
	visitName,
	...props
}: DeleteVisitButtonProps) {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: ({ id }: { id: string }) => deleteVisit(id),
	});
	const [openDialog, setOpenDialog] = useState(false);

	function handleClick() {
		mutate(
			{ id },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['visitedMuseums'] });
				},
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
				title="Are you sure?"
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				onDelete={handleClick}
			>
				<Typography>
					Are you sure to delete your visit <b>{visitName}</b>
				</Typography>
			</DeleteConfirmDialog>
		</>
	);
}
