import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacsConfigurationComponent } from './layout/pacs-configuration/pacs-configuration.component';
import { MainComponent } from './pages/main/main.component';
import { PacsConfigurationFormComponent } from './components/pacs-configuration-form/pacs-configuration-form.component';

const routes: Routes = [
  {
    path: '', component: PacsConfigurationComponent,
    children: [
      { path: 'main', component: MainComponent },
      { path: 'register', component: PacsConfigurationFormComponent },
      { path: ':id', component: PacsConfigurationFormComponent },
      { path: '**', redirectTo: 'main' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacsConfigurationRoutingModule { }
