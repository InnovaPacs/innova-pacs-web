export interface PacsConfiguration {
    id: string;
    title: string;
    port: string;
    ipAddress: string;
    isActive: boolean;
    medicalOfficeId: string;
}

export interface UpdatePacsConfiguration {
    title: string;
    port: string;
    ipAddress: string;
    isActive: boolean;
}