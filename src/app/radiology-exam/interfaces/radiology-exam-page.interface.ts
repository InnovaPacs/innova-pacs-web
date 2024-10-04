import { RadiolodyExam } from "./radiology-exam.interface";

export interface RadiolodyExamPage {
    content: RadiolodyExam[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}