import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientPortalRoutingModule } from './patient-portal-routing.module';
import { VerifyComponent } from './pages/verify/verify.component';
import { PatientStudiesComponent } from './pages/studies/patient-studies.component';
import { PatientViewerComponent } from './pages/viewer/patient-viewer.component';

@NgModule({
  declarations: [
    VerifyComponent,
    PatientStudiesComponent,
    PatientViewerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientPortalRoutingModule,
  ],
})
export class PatientPortalModule {}
