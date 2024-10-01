import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientLayoutComponent } from './layout/patient-layout/patient-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PatientLayoutComponent,
    MainComponent,
    PatientFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PatientsRoutingModule,
    SharedModule
  ]
})
export class PatientsModule { }
