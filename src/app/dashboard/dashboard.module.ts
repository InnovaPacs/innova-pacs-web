import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './pages/main/main.component';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
