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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { addVisit } from '../api/visit/add-visit';
import { Error } from './error';
import { MuseumAutocomplete } from './museum-autocomplete';

const formSchema = z.object({
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
			comment: '',
			museum: {
				id: '',
				label: '',
			},
		},
	});
	const [showError, setShowError] = useState(false);

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(
			{
				comment: values.comment,
				museumId: values.museum.id,
			},
			{
				onSuccess: () => {
					setShowError(false);
					if (props.onClose) props.onClose({}, 'escapeKeyDown');

					queryClient.invalidateQueries({ queryKey: ['visits'] });
				},
				onError: () => {
					setShowError(true);
				},
			}
		);
	}

	return (
		<Dialog
			{...props}
			onClose={() => {
				setShowError(false);
				reset();
				if (props.onClose) {
					props.onClose({}, 'escapeKeyDown');
				}
			}}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Add visit</DialogTitle>
				<DialogContent
					sx={{
						width: '100vw',
						maxWidth: 500,
					}}
				>
					<Stack spacing={2}>
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
						{showError && (
							<Error text="Something is wrong. Please try again." />
						)}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setShowError(false);
							reset();
							onCancel();
						}}
					>
						Cancel
					</Button>
					<LoadingButton loading={isPending} variant="contained" type="submit">
						Add
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
