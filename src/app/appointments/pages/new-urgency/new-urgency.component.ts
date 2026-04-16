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
  }

  public handleNewAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
  }
}
