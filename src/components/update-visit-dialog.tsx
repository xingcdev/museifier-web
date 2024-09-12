import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isErrorDto } from '../api/dtos/errorDto';
import type { VisitDto } from '../api/dtos/visitDto';
import { VisitErrorCode } from '../api/visit-error-code';
import { updateVisit } from '../api/visit/update-visit';
import { Error } from './ui/errors/error';

const formSchema = z.object({
	title: z
		.string()
		.min(2, 'Le titre doit comporter entre 2 et 50 caractères.')
		.max(50, 'Le titre doit comporter entre 2 et 50 caractères.'),
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
	onSuccess?: (data: VisitDto) => void;
}

export function UpdateVisitDialog({
	visitId,
	initialValues,
	onSuccess,
	...props
}: UpdateVisitDialogProps) {
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
				onSuccess: (data) => {
					setError('');
					// reset();
					if (onSuccess) {
						onSuccess(data);
					}
					if (props.onClose) props.onClose({}, 'escapeKeyDown');
				},
				onError: (error) => {
					if (isErrorDto(error)) {
						if (error.code === VisitErrorCode.VISIT_NOT_FOUND) {
							setError(
								`La visite que vous avez fournie n'existe pas, veuillez réessayer.`
							);
						} else {
							setError('Il y a un problème, veuillez réessayer.');
						}
					}
				},
			}
		);
	}

	return (
		<Dialog {...props} onClose={handleClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Modifier une visite</DialogTitle>
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
							label="Titre"
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
							label="Commentaire"
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
						Annuler
					</Button>
					<LoadingButton
						loading={isPending}
						variant="contained"
						type="submit"
						disabled={!isDirty}
					>
						Modifier
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
