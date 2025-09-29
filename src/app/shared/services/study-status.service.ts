import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StudyStatusService {
  constructor() { }
  statuses = [
    { code: 'CREATED', name: 'Finializado' },
    { code: 'SCHEDULED', name: 'En proceso' },
    { code: 'CANCELLED', name: 'Cancelado', },
    { code: 'INTERPRETED', name: 'Interpretado' }
  ];

  getStatusName(statusCode: string): string {
    return this.statuses.find(status => status.code === statusCode)?.name || '-';
  }
}