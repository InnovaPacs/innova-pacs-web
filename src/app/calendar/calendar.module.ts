import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarLayoutComponent } from './layout/calendar-layout/calendar-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular'; 

@NgModule({
  declarations: [
    CalendarLayoutComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    FullCalendarModule
  ]
})
export class CalendarModule { }
