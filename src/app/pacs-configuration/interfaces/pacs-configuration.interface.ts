export interface PacsConfiguration {
    id: string;
    title: string;
    port: string;
    ipAddress: string;
    medicalOfficeId: string;
}

export interface UpdatePacsConfiguration {
    title: string;
    port: string;
    ipAddress: string;
}