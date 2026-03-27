import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PatientPortalService } from '../services/patient-portal.service';

export const patientVerifiedGuard: CanActivateFn = () => {
  const patientPortalService = inject(PatientPortalService);
  const router = inject(Router);

  if (patientPortalService.verifiedPatient() !== null) {
    return true;
  }

  router.navigateByUrl('/patient-portal/verify');
  return false;
};
