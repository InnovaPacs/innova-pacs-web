import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacsConfigurationRoutingModule } from './pacs-configuration-routing.module';
import { MainComponent } from './pages/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { PacsConfigurationComponent } from './layout/pacs-configuration/pacs-configuration.component';
import { PacsConfigurationFormComponent } from './components/pacs-configuration-form/pacs-configuration-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    PacsConfigurationComponent,
    PacsConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    PacsConfigurationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PacsConfigurationModule { }
