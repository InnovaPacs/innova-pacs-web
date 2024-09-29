import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalOfficeRoutingModule } from './medical-office-routing.module';
import { MedicalOfficeLayoutComponent } from './layout/medical-office-layout/medical-office-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { MedicalOfficeFormComponent } from './components/medical-office-form/medical-office-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MedicalOfficeLayoutComponent,
    MainComponent,
    MedicalOfficeFormComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MedicalOfficeRoutingModule,
    SharedModule
  ]
})
export class MedicalOfficeModule { }
