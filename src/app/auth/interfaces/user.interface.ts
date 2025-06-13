export interface User {
    id:      string;
    email:    string;
    username:     string;
    isActive: boolean;
    roles:    string[];
    photo: string;
}

export interface SignUp {
    email: string | null |undefined;
    username: string | null |undefined;
    password: string | null |undefined;
}