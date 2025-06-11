export interface User {
    id:      string;
    email:    string;
    username:     string;
    isActive: boolean;
    roles:    string[];
    photo: string;
}