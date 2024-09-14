import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isErrorDto } from '../api/dtos/errorDto';
import type { VisitDto } from '../api/dtos/visitDto';
import { VisitErrorCode } from '../api/visit-error-code';
import { createVisit } from '../api/visit/create-visit';
import { MuseumAutocomplete } from './museum-autocomplete';
import { Error } from './ui/errors/error';

const formSchema = z.object({
	title: z
		.string()
		// The title must be between 2 and 50 characters long.
		.min(2, 'Le titre doit comporter entre 2 et 50 caractères.')
		.max(50, 'Le titre doit comporter entre 2 et 50 caractères.'),
	visitDate: z.instanceof(dayjs as unknown as typeof Dayjs),
	rating: z
		.number()
		.min(1, 'La note doit être comprise entre 1 et 5.')
		.max(5, 'La note doit être comprise entre 1 et 5.'),
	comment: z
		.string()
		.min(2, 'Le commentaire doit contenir au moins 2 caractères')
		.max(255),
	museum: z.object(
		{
			id: z.string(),
			label: z.string(),
		},
		{ message: 'Veuillez sélectionner un musée valide' }
	),
});

interface CreateVisitFormDialogProps extends DialogProps {
	onSuccess?: (data: VisitDto) => void;
}

export function CreateVisitFormDialog({
	onSuccess,
	...props
}: CreateVisitFormDialogProps) {
	const { mutate, isPending } = useMutation({
		mutationFn: createVisit,
	});
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors: formErrors },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			visitDate: dayjs(),
			rating: 1,
			comment: '',
			museum: {
				id: '',
				label: '',
			},
		},
	});
	const [error, setError] = useState('');

	function handleClose(
		_event: object,
		reason: 'backdropClick' | 'escapeKeyDown'
	) {
		if (reason && reason == 'backdropClick') {
			return;
		}
		setError('');
		reset();

		if (props.onClose) {
			props.onClose({}, 'escapeKeyDown');
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(
			{
				title: values.title,
				visitDate: values.visitDate.toDate(),
				rating: values.rating,
				comment: values.comment,
				museumId: values.museum.id,
			},
			{
				onSuccess: (data) => {
					setError('');
					if (onSuccess) {
						onSuccess(data);
					}
					if (props.onClose) props.onClose({}, 'escapeKeyDown');
				},
				onError: (error) => {
					setError('Il y a un problème, veuillez réessayer.');
					if (isErrorDto(error)) {
						if (error.code === VisitErrorCode.MUSEUM_ALREADY_VISITED) {
							setError(
								`Le musée est déjà visité le ${values.visitDate.toString()}, veuillez sélectionner un autre musée.`
							);
						}
					}
				},
			}
		);
	}

	return (
		<Dialog {...props} onClose={handleClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Ajouter un musée</DialogTitle>
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

						<Controller
							name="rating"
							control={control}
							render={({ field }) => (
								<Rating
									value={field.value}
									onChange={(_, value) => field.onChange(value)}
								/>
							)}
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

						<Controller
							name="visitDate"
							control={control}
							render={({ field }) => (
								<DatePicker
									{...field}
									disableFuture
									label="Date de visite"
									slotProps={{
										textField: {
											helperText: formErrors.visitDate?.message,
										},
									}}
								/>
							)}
						/>

						<Controller
							name="museum"
							control={control}
							render={({ field }) => (
								<MuseumAutocomplete
									value={field.value}
									onChange={(_, value) => field.onChange(value)}
									error={!!formErrors.museum}
									helperText={formErrors.museum?.message}
								/>
							)}
						/>
						{error && <Error text={error} />}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setError('');
							reset();
							if (props.onClose) {
								props.onClose({}, 'escapeKeyDown');
							}
						}}
					>
						Annuler
					</Button>
					<LoadingButton loading={isPending} variant="contained" type="submit">
						Créer
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
