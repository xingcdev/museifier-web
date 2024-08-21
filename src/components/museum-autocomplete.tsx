import Autocomplete, {
	type AutocompleteProps,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { forwardRef } from 'react';
import { getMuseums } from '../api/museum/get-museums';

export interface MuseumAutocompleteProps
	extends Omit<
		AutocompleteProps<
			{
				id: string;
				label: string;
			},
			false,
			false,
			false
		>,
		'options' | 'renderInput'
	> {
	error?: boolean;
	helperText?: string;
}

export const MuseumAutocomplete = forwardRef(
	(
		{ error, helperText, ...props }: MuseumAutocompleteProps,
		ref: React.Ref<HTMLDivElement>
	) => {
		const { data, isPending } = useQuery({
			queryFn: () => getMuseums(),
			queryKey: ['museums'],
		});

		const options =
			data?.data.map((museum) => ({
				id: museum.id,
				label: museum.name,
			})) || [];

		return (
			<Autocomplete
				{...props}
				ref={ref}
				id="museum-autocomplete"
				// open={open}
				// onOpen={() => {
				// 	setOpen(true);
				// }}
				// onClose={() => {
				// 	setOpen(false);
				// }}
				options={options}
				loading={isPending}
				isOptionEqualToValue={(option, value) => option.label === value.label}
				// getOptionLabel={(option) => option.label}
				renderInput={(params) => (
					<TextField
						{...params}
						error={error}
						helperText={helperText}
						label="Museum"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{isPending ? (
										<CircularProgress color="inherit" size={20} />
									) : null}
									{params.InputProps.endAdornment}
								</>
							),
						}}
					/>
				)}
			/>
		);
	}
);
