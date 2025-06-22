import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Appointment, NewAppointment } from '../../interfaces/appointment.interface';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrl: './new-appointment.component.css'
})
export class NewAppointmentComponent {
  public appointmentId!: string;

  ngOnInit(): void {
  }

  public handleNewAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
    console.log(`appointmentId ${appointmentId}`);
  }
}
