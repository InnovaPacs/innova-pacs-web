import { Component, inject } from '@angular/core';
import { PatientService } from '../../../patients/services/patient.service';
import { DoctorService } from '../../../doctors/services/doctor.service';

@Component({
    selector: 'app-new-urgency',
    templateUrl: './new-urgency.component.html',
    styleUrl: './new-urgency.component.css',
    standalone: false
})
export class NewUrgencyComponent {
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  public appointmentId!: string;

  ngOnInit(): void {
    this.doctorService.getByName('DOCTOR EN TURNO (ASIGNAR)').subscribe({
      next: (data) => {
        console.log('Doctor encontrado:', data);
      },
      error: (err) => {
        console.error('Error fetching doctor by name:', err);
      },
      complete: () => {
        console.log('Búsqueda completada.');
      },
    });

    this.patientService.getByCurp('DESCONOCIDO').subscribe({
      next: (data) => {
        console.log('Paciente encontrado:', data);
      },
      error: (err) => {
        console.error('Error fetching patient by CURP:', err);
      },
      complete: () => {
        console.log('Búsqueda completada.');
      },
    });
  }

  public handleNewAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
  }
}
