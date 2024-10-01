export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: string;
	address: string;
	phone: string;
	email: string;
}

export interface UpdatePatient {
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: string;
	address: string;
	phone: string;
	email: string;
}