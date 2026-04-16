export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  photo: string;
  userId: string;
}

export interface UpdateDoctor {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  photo: string;
}
