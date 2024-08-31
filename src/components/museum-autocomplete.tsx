import Autocomplete, {
	type AutocompleteProps,
} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { forwardRef, useEffect, useState, type SyntheticEvent } from 'react';
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
		const [inputValue, setInputValue] = useState('');
		const debouncedSearchTerm = useDebounce(searchTerm, 1000);
		const getMuseumsParams: GetMuseumsParams = {
			page: 1,
			size: 10,
			q: debouncedSearchTerm,
		};

		const [fetchQuery, setFetchQuery] = useState(true);

		const { data, isFetching } = useQuery({
			queryFn: () => getMuseums(getMuseumsParams),
			queryKey: ['museums', getMuseumsParams],
			enabled: fetchQuery,
		});

		function handleInputChange(
			_: SyntheticEvent<Element, Event>,
			newValue: string
		) {
			setSearchTerm(newValue);
			setInputValue(newValue);
		}

		// Don't fetch the list of museum when we select an option
		useEffect(() => {
			setFetchQuery(!(props.value?.label === inputValue));
		}, [props.value?.label, inputValue]);

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
				onOpen={() => {
					setSearchTerm('');
				}}
				inputValue={inputValue}
				onInputChange={handleInputChange}
				options={options}
				loading={isFetching}
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
									{isFetching ? (
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
