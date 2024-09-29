import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorsRoutingModule } from './doctors-routing.module';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { DoctorLayoutComponent } from './layout/doctor-layout/doctor-layout.component';
import { DoctorFormComponent } from './components/doctor-form/doctor-form.component';
import { MedicalOfficeRoutingModule } from '../medical-office/medical-office-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    DoctorLayoutComponent,
    DoctorFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DoctorsRoutingModule,
    SharedModule,
    MedicalOfficeRoutingModule
  ]
})
export class DoctorsModule { }
