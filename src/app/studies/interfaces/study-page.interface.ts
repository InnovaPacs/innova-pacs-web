import { Study } from "./study.interface";

export interface StudyPage {
    content: Study[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}