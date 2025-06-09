import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsLayoutComponent } from './layout/appointments-layout/appointments-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientsModule } from '../patients/patients.module';


@NgModule({
  declarations: [
    AppointmentsLayoutComponent,
    MainComponent,
    AppointmentFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule,
    PatientsModule
  ]
})
export class AppointmentsModule { }
