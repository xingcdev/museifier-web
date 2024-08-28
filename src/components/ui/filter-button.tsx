import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';

interface FilterButtonProps extends ButtonProps {
	numberOfFilters?: number;
}

export function FilterButton({ numberOfFilters, ...props }: FilterButtonProps) {
	const badge = (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			bgcolor="primary.main"
			color="primary.contrastText"
			width={18}
			height={18}
			borderRadius={10}
		>
			{numberOfFilters}
		</Box>
	);

	return (
		<Button
			{...props}
			variant="outlined"
			startIcon={numberOfFilters ? badge : <FilterListOutlinedIcon />}
			size="small"
			sx={{
				color: 'text.primary',
				borderColor: 'grey.400',
				width: 100,
				borderRadius: 10,
				'.MuiButton-startIcon > :nth-of-type(1)': {
					fontSize: numberOfFilters ? 12 : 18,
				},
			}}
		>
			Filter
		</Button>
	);
}
