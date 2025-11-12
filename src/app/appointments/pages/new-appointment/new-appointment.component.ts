import { Component } from '@angular/core';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrl: './new-appointment.component.css',
})
export class NewAppointmentComponent {
  public appointmentId!: string;

  ngOnInit(): void {}

  public handleNewAppointment(appointmentId: string) {
    this.appointmentId = appointmentId;
  }
}
