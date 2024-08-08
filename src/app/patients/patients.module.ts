import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientLayoutComponent } from './layout/patient-layout/patient-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PatientLayoutComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    SharedModule
  ]
})
export class PatientsModule { }
