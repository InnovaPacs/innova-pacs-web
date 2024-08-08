import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarLayoutComponent } from './layout/calendar-layout/calendar-layout.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: CalendarLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
