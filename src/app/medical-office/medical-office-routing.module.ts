import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalOfficeLayoutComponent } from './layout/medical-office-layout/medical-office-layout.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: MedicalOfficeLayoutComponent,
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
export class MedicalOfficeRoutingModule { }
