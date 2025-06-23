import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyLayoutComponent } from './layout/study-layout/study-layout.component';
import { MainComponent } from './pages/main/main.component';
import { StudyFormComponent } from './components/study-form/study-form.component';

const routes: Routes = [
  {
    path: '', component: StudyLayoutComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: StudyFormComponent },
      { path: ':studyId', component: StudyFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyRoutingModule { }
