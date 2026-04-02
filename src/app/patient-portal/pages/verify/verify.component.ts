import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientPortalService } from '../../services/patient-portal.service';

const CURP_REGEX =
  /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;

@Component({
    selector: 'app-patient-verify',
    templateUrl: './verify.component.html',
    standalone: false
})
export class VerifyComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientPortalService = inject(PatientPortalService);

  public form: FormGroup = this.fb.group({
    curp: ['', [Validators.required, Validators.pattern(CURP_REGEX)]],
  });

  public loading = false;
  public error: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const curp = this.form.value.curp.toUpperCase();

    this.patientPortalService.getPatientByCurp(curp).subscribe({
      next: (patient) => {
        this.patientPortalService.verifiedPatient.set(patient);
        this.router.navigateByUrl('/patient-portal/studies');
      },
      error: () => {
        this.error = 'No se encontró un paciente con la CURP proporcionada. Verifique los datos e intente nuevamente.';
        this.loading = false;
      },
    });
  }
}
