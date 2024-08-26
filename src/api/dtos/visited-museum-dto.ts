export interface VisitedMuseumDto {
	id: string;
	name: string;
	address: string;
	postalCode: string;
	city: string;
	department: string;
	phoneNumber: string;
	url: string;
	latitude: number;
	longitude: number;
	visits: VisitedMuseumVisitsDto[];
}

interface VisitedMuseumVisitsDto {
	id: string;
	title: string;
	visitDate: string;
	rating: number;
	comment: string;
	created: string;
	updated: string;
}
