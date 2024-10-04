import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadiologyExamRoutingModule } from './radiology-exam-routing.module';
import { RadiologyExamLayoutComponent } from './layout/radiology-exam-layout/radiology-exam-layout.component';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './pages/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RadiologyExamFormComponent } from './components/radiology-exam-form/radiology-exam-form.component';


@NgModule({
  declarations: [
    RadiologyExamLayoutComponent,
    MainComponent,
    RadiologyExamFormComponent
  ],
  imports: [
    CommonModule,
    RadiologyExamRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RadiologyExamModule { }
