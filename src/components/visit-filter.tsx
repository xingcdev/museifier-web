import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState, type FormEventHandler } from 'react';
import { useSearchParams } from 'react-router-dom';

type VisitFilterProps = BoxProps<'form'>;

export function VisitFilter(props: VisitFilterProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [department, setDepartment] = useState('');

	function resetSearchParams() {
		searchParams.delete('city');
		searchParams.delete('postalCode');
		searchParams.delete('department');
		setCity('');
		setPostalCode('');
		setDepartment('');
		setSearchParams(searchParams);
	}

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (city) {
			searchParams.set('city', city);
		} else {
			searchParams.delete('city');
		}

		if (postalCode) {
			searchParams.set('postalCode', postalCode);
		} else {
			searchParams.delete('postalCode');
		}

		if (department) {
			searchParams.set('department', department);
		} else {
			searchParams.delete('department');
		}

		setSearchParams(searchParams);
	};

	return (
		<Box
			{...props}
			display="flex"
			flexDirection="row"
			pb={4}
			gap={3}
			component="form"
			onSubmit={handleSubmit}
		>
			<TextField
				name="city"
				label="Ville"
				size="small"
				sx={{ flexGrow: 1 }}
				value={city}
				onChange={(e) => setCity(e.target.value)}
			/>
			<TextField
				name="postalCode"
				label="Code postal"
				size="small"
				sx={{ flexGrow: 1 }}
				value={postalCode}
				onChange={(e) => setPostalCode(e.target.value)}
			/>
			<TextField
				name="department"
				label="Département"
				size="small"
				sx={{ flexGrow: 1 }}
				value={department}
				onChange={(e) => setDepartment(e.target.value)}
			/>

			<Stack direction="row">
				<Button type="submit">Valider</Button>
				<Button onClick={resetSearchParams} color="info">
					Réinitialiser
				</Button>
			</Stack>
		</Box>
	);
}
