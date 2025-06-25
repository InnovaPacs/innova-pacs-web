export interface PacsConfiguration {
    id: string;
    title: string;
    hl7port: string;
    dicomPort: string;
    ipAddress: string;
    isActive: boolean;
    medicalOfficeId: string;
    viewerUrl: string;
}

export interface UpdatePacsConfiguration {
    title: string;
    hl7port: string;
    dicomPort: string;
    ipAddress: string;
    isActive: boolean;
    viewerUrl: string;
}