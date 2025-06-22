import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsLayoutComponent } from './layout/appointments-layout/appointments-layout.component';
import { MainComponent } from './pages/main/main.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { NewAppointmentComponent } from './pages/new-appointment/new-appointment.component';

const routes: Routes = [
  {
    path: '', component: AppointmentsLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: AppointmentFormComponent },
      { path: 'new', component: NewAppointmentComponent },
      { path: ':id', component: AppointmentFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
