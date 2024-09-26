import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalOfficeRoutingModule } from './medical-office-routing.module';
import { MedicalOfficeLayoutComponent } from './layout/medical-office-layout/medical-office-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MedicalOfficeLayoutComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    MedicalOfficeRoutingModule,
    SharedModule
  ]
})
export class MedicalOfficeModule { }
