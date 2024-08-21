import { zodResolver } from '@hookform/resolvers/zod';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack, { type StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateVisit } from '../api/visit/update-visit';
import { DeleteVisitButton } from './delete-visit-button';

export interface VisitCardProps extends StackProps {
	visitId: string;
	comment: string;
	museum: {
		name: string;
		address: string;
		postalCode: string;
		city: string;
		url: string;
	};
}

const formSchema = z.object({
	comment: z
		.string()
		.min(2, 'The comment must contain at least 2 characters')
		.max(255),
});

export function VisitCard({
	visitId,
	comment,
	museum,
	...props
}: VisitCardProps) {
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment,
		},
	});

	const [editableMode, setEditableMode] = useState(false);

	const { mutate } = useMutation({
		mutationFn: ({ id, comment }: { id: string; comment: string }) =>
			updateVisit(id, comment),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(
			{ id: visitId, comment: values.comment },
			{
				onSuccess: () => {
					setEditableMode(false);
					queryClient.invalidateQueries({ queryKey: ['visits'] });
				},
			}
		);
	}
	return (
		<Stack
			{...props}
			direction="row"
			borderBottom={1}
			p={4}
			borderColor="divider"
		>
			<Stack direction="row" width="100%">
				<Box flexBasis={400} flexShrink={0}>
					<Typography fontWeight={500} textTransform="capitalize">
						{museum.name}
					</Typography>
					<Typography>{museum.address}</Typography>
					<Typography>
						{museum.postalCode} {museum.city}
					</Typography>
					<Link href={museum.url}>{museum.url}</Link>
				</Box>
				<Box flexBasis={0} flexGrow={1} pl={4} pr={editableMode ? 0 : 4}>
					{editableMode ? (
						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack spacing={1} direction="row" flexGrow={1}>
								<TextField
									error={!!formErrors.comment}
									helperText={formErrors.comment?.message}
									label="Comment"
									multiline
									rows={3}
									fullWidth
									size="small"
									{...register('comment')}
								/>
								<Stack>
									<IconButton size="small" type="submit" color="success">
										<CheckOutlinedIcon />
									</IconButton>
									<IconButton
										size="small"
										onClick={() => setEditableMode(false)}
									>
										<ClearIcon />
									</IconButton>
								</Stack>
							</Stack>
						</form>
					) : (
						<Typography>{comment}</Typography>
					)}
				</Box>
				<Box flexBasis={80} flexShrink={0}>
					<IconButton
						onClick={() => setEditableMode(true)}
						sx={{ visibility: editableMode ? 'hidden' : 'visible' }}
					>
						<EditOutlinedIcon />
					</IconButton>
					<DeleteVisitButton
						id={visitId}
						visitName={museum.name}
						sx={{ visibility: editableMode ? 'hidden' : 'visible' }}
					/>
				</Box>
			</Stack>
		</Stack>
	);
}
