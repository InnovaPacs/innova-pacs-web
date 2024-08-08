import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsLayoutComponent } from './layout/appointments-layout/appointments-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AppointmentsLayoutComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule
  ]
})
export class AppointmentsModule { }
