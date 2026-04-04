export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id:       string;
  email:    string;
  username: string;
  isActive: boolean;
  roles:    UserRole[];
  photo:    string;
}

export interface SignUp {
    email: string | null |undefined;
    username: string | null |undefined;
    password: string | null |undefined;
}