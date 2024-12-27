import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarLayoutComponent } from './layout/calendar-layout/calendar-layout.component';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ScheduleComponent } from './pages/schedule/schedule.component'; 
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CalendarLayoutComponent,
    MainComponent,
    ScheduleComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    FullCalendarModule
  ]
})
export class CalendarModule { }
