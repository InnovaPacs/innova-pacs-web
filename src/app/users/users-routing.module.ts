import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersLayoutComponent } from './layout/users-layout/users-layout.component';
import { MainComponent } from './pages/main/main.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  {
    path: '', component: UsersLayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'register', component: UserFormComponent },
      { path: ':id', component: UserFormComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
