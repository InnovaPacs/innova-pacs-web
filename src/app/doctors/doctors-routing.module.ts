import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLayoutComponent } from './layout/doctor-layout/doctor-layout.component';
import { MainComponent } from './pages/main/main.component';
import { DoctorFormComponent } from './components/doctor-form/doctor-form.component';

const routes: Routes = [
  {
    path: '', component: DoctorLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: DoctorFormComponent },
      { path: ':id', component: DoctorFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
