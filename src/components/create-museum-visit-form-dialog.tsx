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
import { Error } from './ui/errors/error';

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
});

export interface CreateMuseumVisitFormDialogProps extends DialogProps {
	museumId: string;
	museumName: string;
	onSuccess?: (data: VisitDto) => void;
}

export function CreateMuseumVisitFormDialog({
	museumId,
	museumName,
	onSuccess,
	...props
}: CreateMuseumVisitFormDialogProps) {
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
		},
	});
	const [error, setError] = useState('');

	function handleClose(
		event: object,
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
				museumId,
			},
			{
				onSuccess: (data) => {
					setError('');
					// reset();
					if (props.onClose) props.onClose({}, 'escapeKeyDown');
					if (onSuccess) {
						onSuccess(data);
					}
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
		<Dialog {...props} onClose={handleClose} fullWidth maxWidth="sm">
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle textTransform="capitalize">{museumName}</DialogTitle>
				<DialogContent>
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
