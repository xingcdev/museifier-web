import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);
	let errorMessage = '';

	if (isRouteErrorResponse(error)) {
		errorMessage = error.data;
	} else if (error instanceof Error) {
		errorMessage = error.message;
	} else {
		errorMessage = 'Unknown error';
	}

	return (
		<div>
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{errorMessage}</i>
			</p>
		</div>
	);
}
