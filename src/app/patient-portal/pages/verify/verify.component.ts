import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientPortalService } from '../../services/patient-portal.service';

@Component({
  selector: 'app-patient-verify',
  templateUrl: './verify.component.html',
  standalone: false,
})
export class VerifyComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientPortalService = inject(PatientPortalService);

  public form: FormGroup = this.fb.group({
    patientId: ['', [Validators.required]],
  });

  public loading = false;
  public error: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const patientId = this.form.value.patientId.trim();

    this.patientPortalService.getPatientById(patientId).subscribe({
      next: (patient) => {
        this.patientPortalService.verifiedPatient.set(patient);
        this.router.navigateByUrl('/patient-portal/studies');
      },
      error: () => {
        this.error =
          'No se encontró un paciente con el Folio proporcionado. Verifique los datos e intente nuevamente.';
        this.loading = false;
      },
    });
  }
}
