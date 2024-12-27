export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	gender: string;
	address: string;
	phoneNumber: string;
	email: string;
	photo: string;
	documentId: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	notes: string;
	maritalStatus: string;
	curp: string;
	rfc: string;
}

export interface UpdatePatient {
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	gender: string;
	address: string;
	phoneNumber: string;
	email: string;
	photo: string;
	documentId: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	notes: string;
	maritalStatus: string;
	curp: string;
	rfc: string;
}