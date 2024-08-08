import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: DashboardLayoutComponent,
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
export class DashboardRoutingModule { }
