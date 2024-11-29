import { PacsConfiguration } from "./pacs-configuration.interface";

export interface PacsConfigurationPage {
    content: PacsConfiguration[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}