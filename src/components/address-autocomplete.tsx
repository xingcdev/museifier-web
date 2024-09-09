import SearchIcon from '@mui/icons-material/Search';
import Autocomplete, {
	type AutocompleteProps,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { forwardRef, type FormEventHandler } from 'react';

export interface AddressAutocompleteProps
	extends Omit<AutocompleteProps<string, false, false, false>, 'renderInput'> {
	error?: boolean;
	helperText?: string;
	onSearch?: () => void;
}

export const AddressAutocomplete = forwardRef(
	(
		{ error, helperText, onSearch, ...props }: AddressAutocompleteProps,
		ref: React.Ref<HTMLDivElement>
	) => {
		const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault();
			if (onSearch) {
				onSearch();
			}
		};

		const inputValue = props.inputValue || '';

		return (
			<Autocomplete
				{...props}
				ref={ref}
				id="address-autocomplete"
				noOptionsText="Veuillez saisir une adresse"
				// isOptionEqualToValue={(option, value) => option.label === value.label}
				// Disable the built-in filtering
				filterOptions={(x) => x}
				autoHighlight
				renderInput={(params) => (
					<Box display="flex" component="form" onSubmit={handleSubmit}>
						<TextField
							{...params}
							error={error}
							helperText={helperText}
							size="small"
							placeholder="57 rue de Varenne 75007 Paris "
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{inputValue.length > 5 && props.loading ? (
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
