import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyRoutingModule as StudyRoutingModule } from './study-routing.module';
import { StudyLayoutComponent as StudyLayoutComponent } from './layout/study-layout/study-layout.component';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './pages/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StudyFormComponent as StudyFormComponent } from './components/study-form/study-form.component';


@NgModule({
  declarations: [
    StudyLayoutComponent,
    MainComponent,
    StudyFormComponent
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class StudyModule { }
