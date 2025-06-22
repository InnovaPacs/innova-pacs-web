import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsLayoutComponent } from './layout/appointments-layout/appointments-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from "../doctors/doctors.module";
import { NewAppointmentComponent } from './pages/new-appointment/new-appointment.component';
import { StudyModule } from '../studies/study.module';


@NgModule({
  declarations: [
    AppointmentsLayoutComponent,
    MainComponent,
    AppointmentFormComponent,
    NewAppointmentComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule,
    DoctorsModule,
    PatientsModule,
    StudyModule
  ]
})
export class AppointmentsModule { }
