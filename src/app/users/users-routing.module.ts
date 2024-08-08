import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersLayoutComponent } from './layout/users-layout/users-layout.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: UsersLayoutComponent,
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
export class UsersRoutingModule { }
