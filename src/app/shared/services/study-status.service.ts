import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StudyStatusService {
  constructor() { }
  statuses = [
    { code: 'CREATED', name: 'Creada' },
    { code: 'SCHEDULED', name: 'En proceso' },
    { code: 'CANCELLED', name: 'Cancelado', },
    { code: 'INTERPRETED', name: 'Interpretado' },
    { code: 'COMPLETED', name: 'Completada' }
  ];

  getStatusName(statusCode: string): string {
    return this.statuses.find(status => status.code === statusCode)?.name || '-';
  }
}