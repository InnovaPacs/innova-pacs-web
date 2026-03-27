import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './pages/verify/verify.component';
import { PatientStudiesComponent } from './pages/studies/patient-studies.component';
import { PatientViewerComponent } from './pages/viewer/patient-viewer.component';
import { patientVerifiedGuard } from './guards/patient-verified.guard';

const routes: Routes = [
  { path: 'verify', component: VerifyComponent },
  {
    path: 'studies',
    component: PatientStudiesComponent,
    canActivate: [patientVerifiedGuard],
  },
  {
    path: 'viewer/:studyId',
    component: PatientViewerComponent,
    canActivate: [patientVerifiedGuard],
  },
  { path: '**', redirectTo: 'verify' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientPortalRoutingModule {}
