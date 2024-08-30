import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isErrorDto } from '../api/dtos/errorDto';
import { VisitErrorCode } from '../api/visit-error-code';
import { updateVisit } from '../api/visit/update-visit';
import { Error } from './error';

const formSchema = z.object({
	title: z
		.string()
		.min(2, 'The title must be between 2 and 50 characters long.')
		.max(50, 'The title must be between 2 and 50 characters long.'),
	comment: z
		.string()
		.min(2, 'The comment must contain at least 2 characters')
		.max(255),
});

export interface UpdateVisitDialogProps extends DialogProps {
	visitId: string;
	initialValues?: {
		title: string;
		comment: string;
	};
}

export function UpdateVisitDialog({
	visitId,
	initialValues,
	...props
}: UpdateVisitDialogProps) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: updateVisit,
	});
	const {
		register,
		handleSubmit,
		formState: { errors: formErrors, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: initialValues?.title || '',
			comment: initialValues?.comment || '',
		},
	});
	const [error, setError] = useState('');

	function handleClose(_: object, reason: 'backdropClick' | 'escapeKeyDown') {
		if (reason && reason == 'backdropClick') {
			return;
		}
		setError('');
		if (props.onClose) {
			props.onClose({}, 'escapeKeyDown');
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(
			{
				id: visitId,
				title: values.title,
				comment: values.comment,
			},
			{
				onSuccess: () => {
					setError('');
					// reset();
					queryClient.invalidateQueries({ queryKey: ['visitedMuseums'] });
					if (props.onClose) props.onClose({}, 'escapeKeyDown');
				},
				onError: (error) => {
					if (isErrorDto(error)) {
						if (error.code === VisitErrorCode.VISIT_NOT_FOUND) {
							setError(
								`The visit you provided doesn't exist, please try again.`
							);
						} else {
							setError('Something is wrong, please try again.');
						}
					}
				},
			}
		);
	}

	return (
		<Dialog {...props} onClose={handleClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Update a visit</DialogTitle>
				<DialogContent
					sx={{
						width: '100vw',
						maxWidth: 500,
					}}
				>
					<Stack spacing={2} pt={2}>
						<TextField
							error={!!formErrors.title}
							helperText={formErrors.title?.message}
							label="Title"
							fullWidth
							sx={{
								'.MuiInputBase-input': {
									fontWeight: 500,
								},
							}}
							{...register('title')}
						/>

						<TextField
							error={!!formErrors.comment}
							helperText={formErrors.comment?.message}
							label="Comment"
							multiline
							fullWidth
							rows={4}
							{...register('comment')}
						/>

						{error && <Error text={error} />}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setError('');
							if (props.onClose) {
								props.onClose({}, 'escapeKeyDown');
							}
						}}
					>
						Cancel
					</Button>
					<LoadingButton
						loading={isPending}
						variant="contained"
						type="submit"
						disabled={!isDirty}
					>
						Update
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
