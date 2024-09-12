import Autocomplete, {
	type AutocompleteProps,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { forwardRef, useState } from 'react';
import { getMuseums, type GetMuseumsParams } from '../api/museum/get-museums';

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
		const [searchTerm, setSearchTerm] = useState('');
		const debouncedSearchTerm = useDebounce(searchTerm, 1000);
		const getMuseumsParams: GetMuseumsParams = {
			page: 1,
			size: 10,
			q: debouncedSearchTerm,
		};

		const { data, isPending } = useQuery({
			queryFn: () => getMuseums(getMuseumsParams),
			queryKey: ['museums', getMuseumsParams],
			enabled: debouncedSearchTerm.length >= 3,
			select: (data) =>
				data?.data.map((museum) => ({
					id: museum.id,
					label: museum.name,
				})),
		});

		return (
			<Autocomplete
				{...props}
				ref={ref}
				id="museum-autocomplete"
				inputValue={searchTerm}
				onInputChange={(_, newValue) => setSearchTerm(newValue)}
				options={data || []}
				loading={searchTerm.length > 3 && isPending}
				isOptionEqualToValue={(option, value) => option.label === value.label}
				// Disable the built-in filtering
				filterOptions={(x) => x}
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
