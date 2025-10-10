import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppointmenStatusService {
  constructor() { }
  statuses = [
    { code: 'SCHEDULED', name: 'Agendada', color: 'blue' },
    { code: 'CONFIRMED', name: 'Confirmada', color: 'green' },
    { code: 'CANCELLED', name: 'Cancelada', color: 'red' },
    { code: 'FINISHED', name: 'Finalizada', color: 'purple' },
    { code: 'NO_SHOW', name: 'No Asistió', color: 'orange' },
    { code: 'IN_PROGRESS', name: 'En Progreso', color: 'yellow' }
  ];

  getStatusName(statusCode: string): string {
    return this.statuses.find(status => status.code === statusCode)?.name || '-';
  }
}