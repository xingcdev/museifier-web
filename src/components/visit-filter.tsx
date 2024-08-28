import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

interface VisitFilterProps extends BoxProps {
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function VisitFilter({ handleChange, ...props }: VisitFilterProps) {
	const [searchParams, setSearchParams] = useSearchParams();

	function resetSearchParams() {
		searchParams.delete('city');
		searchParams.delete('postalCode');
		searchParams.delete('department');
		setSearchParams(searchParams);
	}

	return (
		<Box {...props} display="flex" flexDirection="row" pb={4} gap={3}>
			<TextField
				name="city"
				label="City"
				size="small"
				sx={{ flexGrow: 1 }}
				value={searchParams.get('city') || ''}
				onChange={handleChange}
			/>
			<TextField
				name="postalCode"
				label="Postal code"
				size="small"
				sx={{ flexGrow: 1 }}
				value={searchParams.get('postalCode') || ''}
				onChange={handleChange}
			/>
			<TextField
				name="department"
				label="Department"
				size="small"
				sx={{ flexGrow: 1 }}
				value={searchParams.get('department') || ''}
				onChange={handleChange}
			/>
			<Button onClick={resetSearchParams}>Clear</Button>
		</Box>
	);
}
