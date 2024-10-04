import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadiologyExamLayoutComponent } from './layout/radiology-exam-layout/radiology-exam-layout.component';
import { MainComponent } from './pages/main/main.component';
import { RadiologyExamFormComponent } from './components/radiology-exam-form/radiology-exam-form.component';

const routes: Routes = [
  {
    path: '', component: RadiologyExamLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: RadiologyExamFormComponent },
      { path: ':id', component: RadiologyExamFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadiologyExamRoutingModule { }
