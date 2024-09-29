import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalOfficeLayoutComponent } from './layout/medical-office-layout/medical-office-layout.component';
import { MainComponent } from './pages/main/main.component';
import { MedicalOfficeFormComponent } from './components/medical-office-form/medical-office-form.component';

const routes: Routes = [
  {
    path: '', component: MedicalOfficeLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: MedicalOfficeFormComponent },
      { path: ':id', component: MedicalOfficeFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalOfficeRoutingModule { }
