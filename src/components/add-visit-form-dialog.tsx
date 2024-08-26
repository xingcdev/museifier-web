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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isErrorDto } from '../api/dtos/errorDto';
import { VisitErrorCode } from '../api/visit-error-code';
import { addVisit } from '../api/visit/add-visit';
import { Error } from './error';
import { MuseumAutocomplete } from './museum-autocomplete';

const formSchema = z.object({
	title: z
		.string()
		.min(2, 'The title must be between 2 and 50 characters long.')
		.max(50, 'The title must be between 2 and 50 characters long.'),
	visitDate: z.instanceof(dayjs as unknown as typeof Dayjs),
	rating: z
		.number()
		.min(1, 'A rating must be between 1 and 5.')
		.max(5, 'A rating must be between 1 and 5.'),
	comment: z
		.string()
		.min(2, 'The comment must contain at least 2 characters')
		.max(255),
	museum: z.object(
		{
			id: z.string(),
			label: z.string(),
		},
		{ message: 'Please select a valid museum' }
	),
});

export interface AddVisitFormDialogProps extends DialogProps {
	onCancel: () => void;
}

export function AddVisitFormDialog({
	onCancel,
	...props
}: AddVisitFormDialogProps) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: addVisit,
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
				onSuccess: () => {
					setError('');
					reset();
					if (props.onClose) props.onClose({}, 'escapeKeyDown');

					queryClient.invalidateQueries({ queryKey: ['visitedMuseums'] });
				},
				onError: (error) => {
					setError('Something is wrong, please try again.');
					if (isErrorDto(error)) {
						if (error.code === VisitErrorCode.MUSEUM_ALREADY_VISITED) {
							setError(
								`The museum is already visited on ${values.visitDate.toString()}, please select another museum.`
							);
						}
					}
				},
			}
		);
	}

	return (
		<Dialog
			{...props}
			onClose={() => {
				setError('');
				reset();
				if (props.onClose) {
					props.onClose({}, 'escapeKeyDown');
				}
			}}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Create a visit</DialogTitle>
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
							label="Comment"
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
									label="Visit date"
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
							onCancel();
						}}
					>
						Cancel
					</Button>
					<LoadingButton loading={isPending} variant="contained" type="submit">
						Create
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
