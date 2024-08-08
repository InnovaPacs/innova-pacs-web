import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsLayoutComponent } from './layout/appointments-layout/appointments-layout.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: AppointmentsLayoutComponent,
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
export class AppointmentsRoutingModule { }
