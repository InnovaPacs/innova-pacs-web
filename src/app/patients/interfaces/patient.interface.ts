export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: string;
	address: string;
	phone: string;
	email: string;
	photo: string;
	documentId: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	notes: string;
	maritalStatus: string;
}

export interface UpdatePatient {
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: string;
	address: string;
	phone: string;
	email: string;
	photo: string;
	documentId: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	notes: string;
	maritalStatus: string;
}