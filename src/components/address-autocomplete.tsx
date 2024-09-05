import SearchIcon from '@mui/icons-material/Search';
import Autocomplete, {
	type AutocompleteProps,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { forwardRef, type FormEventHandler } from 'react';
import { getAddressAutocompletion } from '../api/geocoding/get-address-autocompletion';

export interface AddressAutocompleteProps
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
	onSearch?: () => void;
}

export const AddressAutocomplete = forwardRef(
	(
		{ error, helperText, ...props }: AddressAutocompleteProps,
		ref: React.Ref<HTMLDivElement>
	) => {
		// const [inputValue, setInputValue] = useState('');
		const inputValue = props?.inputValue || '';
		const debouncedInputValue = useDebounce(inputValue, 1000);
		const { data, isPending } = useQuery({
			queryFn: () => getAddressAutocompletion(debouncedInputValue),
			queryKey: ['address-autocompletion', debouncedInputValue],
			enabled: debouncedInputValue.length >= 5,
		});

		const options =
			data?.features.map((feature) => ({
				id: feature.properties.id,
				label: feature.properties.label,
			})) || [];

		const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault();
			if (props.onSearch) {
				props.onSearch();
			}
		};

		return (
			<Autocomplete
				{...props}
				ref={ref}
				id="address-autocomplete"
				// inputValue={inputValue}
				noOptionsText="Veuillez saisir une adresse"
				// onInputChange={(_, newValue) => setInputValue(newValue)}
				options={options}
				loading={inputValue.length > 5 && isPending}
				isOptionEqualToValue={(option, value) => option.label === value.label}
				// Disable the built-in filtering
				filterOptions={(x) => x}
				renderInput={(params) => (
					<Box display="flex" component="form" onSubmit={handleSubmit}>
						<TextField
							{...params}
							error={error}
							helperText={helperText}
							size="small"
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{inputValue.length > 5 && isPending ? (
											<CircularProgress color="inherit" size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</>
								),
							}}
						/>
						<Button type="submit" variant="contained" size="medium">
							<SearchIcon />
						</Button>
					</Box>
				)}
			/>
		);
	}
);
