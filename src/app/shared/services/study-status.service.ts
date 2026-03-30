import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StudyStatusService {
  constructor() { }
  statuses = [
    { code: 'CREATED', name: 'Creado' },
    { code: 'SCHEDULED', name: 'Programado' },
    { code: 'COMPLETED', name: 'Completado' },
    { code: 'CANCELLED', name: 'Cancelado' },
    { code: 'INTERPRETED', name: 'Interpretado' },
  ];

  getStatusName(statusCode: string): string {
    return this.statuses.find(status => status.code === statusCode)?.name || '-';
  }
}