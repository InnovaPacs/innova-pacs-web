import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientLayoutComponent } from './layout/patient-layout/patient-layout.component';
import { PatientMainComponent } from './pages/main/main.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';

const routes: Routes = [
  {
    path: '', component: PatientLayoutComponent,
    children: [
      { path: 'main', component: PatientMainComponent },
      { path: 'register', component: PatientFormComponent },
      { path: ':id', component: PatientFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
