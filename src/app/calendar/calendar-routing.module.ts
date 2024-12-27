import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarLayoutComponent } from './layout/calendar-layout/calendar-layout.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  {
    path: '', component: CalendarLayoutComponent,
    children: [
      { path: 'schedule', component: ScheduleComponent },
      { path: '**', redirectTo: 'schedule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
