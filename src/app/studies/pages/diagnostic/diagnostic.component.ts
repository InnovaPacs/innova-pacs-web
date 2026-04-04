import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Study } from '../../interfaces/study.interface';
import { Diagnostic, DiagnosticStatus } from '../../interfaces/diagnostic.interface';
import { DiagnosticService } from '../../services/diagnostic.service';
import { StudyService } from '../../services/study.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';

const STATUS_LABELS: Record<DiagnosticStatus, string> = {
  DRAFT: 'Borrador',
  SIGNED: 'Firmado',
  COMPLETED: 'Completado',
};

const ERROR_MESSAGES: Record<number, string> = {
  400: 'El diagnóstico ya fue firmado y no puede modificarse.',
  404: 'No se encontró el diagnóstico.',
  409: 'Ya existe un diagnóstico para este estudio.',
  500: 'Ocurrió un error. Intenta de nuevo.',
};

@Component({
  selector: 'app-diagnostic-page',
  templateUrl: './diagnostic.component.html',
  styleUrl: './diagnostic.component.css',
  standalone: false,
})
export class DiagnosticPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private studyService = inject(StudyService);
  private diagnosticService = inject(DiagnosticService);
  private doctorService = inject(DoctorService);

  public study: Study | null = null;
  public diagnostic: Diagnostic | null = null;
  public doctors: Doctor[] = [];

  public loadingStudy = true;
  public loadingDiagnostic = true;
  public saving = false;
  public signing = false;
  public completing = false;
  public openingPdf = false;
  public errorMsg: string | null = null;
  public successMsg: string | null = null;

  public form: FormGroup = this.fb.group({
    doctorId: [null, Validators.required],
    clinicalInfo: ['', Validators.required],
    technique: ['', Validators.required],
    findings: ['', Validators.required],
    diagnosticImpression: ['', Validators.required],
    recommendations: [''],
  });

  async ngOnInit(): Promise<void> {
    const studyId = this.route.snapshot.paramMap.get('studyId')!;

    try {
      this.study = await firstValueFrom(this.studyService.getById(studyId));
    } catch {
      this.errorMsg = 'No se pudo cargar el estudio.';
      this.loadingStudy = false;
      this.loadingDiagnostic = false;
      return;
    } finally {
      this.loadingStudy = false;
    }

    try {
      this.doctors = await firstValueFrom(this.doctorService.getFullData());
    } catch {
      // selector stays empty
    }

    try {
      this.diagnostic = await firstValueFrom(
        this.diagnosticService.getByStudyId(studyId)
      );
      this.syncFormFromDiagnostic();
    } catch (err) {
      const status = (err as HttpErrorResponse)?.status;
      if (status !== 404) {
        this.errorMsg = ERROR_MESSAGES[status] ?? ERROR_MESSAGES[500];
      }
    } finally {
      this.loadingDiagnostic = false;
    }
  }

  // ── Computed state ────────────────────────────────────

  get loading(): boolean {
    return this.loadingStudy || this.loadingDiagnostic;
  }

  get status(): DiagnosticStatus | null {
    return this.diagnostic?.status ?? null;
  }

  get isDraft(): boolean {
    return this.status === 'DRAFT';
  }

  get isReadOnly(): boolean {
    return this.status === 'SIGNED' || this.status === 'COMPLETED';
  }

  get pdfAvailable(): boolean {
    return this.status === 'SIGNED' || this.status === 'COMPLETED';
  }

  get statusLabel(): string {
    return this.status ? STATUS_LABELS[this.status] : '';
  }

  // ── Actions ───────────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/studies/main']);
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    this.clearMessages();
    const dto = this.buildDto();

    try {
      if (!this.diagnostic) {
        this.diagnostic = await firstValueFrom(
          this.diagnosticService.create(this.study!.id, dto)
        );
      } else {
        this.diagnostic = await firstValueFrom(
          this.diagnosticService.update(this.study!.id, dto)
        );
      }
      this.syncFormFromDiagnostic();
      this.successMsg = 'Diagnóstico guardado como borrador.';
    } catch (err) {
      const status = (err as HttpErrorResponse)?.status;
      if (status === 409) {
        try {
          this.diagnostic = await firstValueFrom(
            this.diagnosticService.update(this.study!.id, dto)
          );
          this.syncFormFromDiagnostic();
          this.successMsg = 'Diagnóstico guardado como borrador.';
        } catch {
          this.errorMsg = ERROR_MESSAGES[500];
        }
      } else {
        this.errorMsg = ERROR_MESSAGES[status] ?? ERROR_MESSAGES[500];
      }
    } finally {
      this.saving = false;
    }
  }

  async sign(): Promise<void> {
    if (!this.diagnostic || this.signing) return;

    this.signing = true;
    this.clearMessages();

    try {
      this.diagnostic = await firstValueFrom(
        this.diagnosticService.sign(this.study!.id)
      );
      this.syncFormFromDiagnostic();
      this.successMsg = 'Diagnóstico firmado correctamente.';
    } catch (err) {
      const status = (err as HttpErrorResponse)?.status;
      this.errorMsg =
        status === 400
          ? 'Solo se puede firmar un diagnóstico en borrador.'
          : ERROR_MESSAGES[500];
    } finally {
      this.signing = false;
    }
  }

  async complete(): Promise<void> {
    if (!this.diagnostic || this.completing) return;

    this.completing = true;
    this.clearMessages();

    try {
      this.diagnostic = await firstValueFrom(
        this.diagnosticService.complete(this.study!.id)
      );
      this.syncFormFromDiagnostic();
      this.successMsg = 'Diagnóstico completado.';
    } catch (err) {
      const status = (err as HttpErrorResponse)?.status;
      this.errorMsg =
        status === 400
          ? 'El diagnóstico debe estar firmado para poder completarse.'
          : ERROR_MESSAGES[500];
    } finally {
      this.completing = false;
    }
  }

  async openPdf(): Promise<void> {
    if (this.openingPdf) return;
    this.openingPdf = true;
    this.clearMessages();

    try {
      await this.diagnosticService.openPdf(this.study!.id);
    } catch {
      this.errorMsg = 'El PDF solo está disponible después de firmar el diagnóstico.';
    } finally {
      this.openingPdf = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────

  private buildDto() {
    const v = this.form.value;
    return {
      doctorId: v.doctorId,
      clinicalInfo: v.clinicalInfo,
      technique: v.technique,
      findings: v.findings,
      diagnosticImpression: v.diagnosticImpression,
      ...(v.recommendations ? { recommendations: v.recommendations } : {}),
    };
  }

  private syncFormFromDiagnostic(): void {
    if (!this.diagnostic) return;
    this.form.patchValue({
      doctorId: this.diagnostic.doctor?.id,
      clinicalInfo: this.diagnostic.clinicalInfo,
      technique: this.diagnostic.technique,
      findings: this.diagnostic.findings,
      diagnosticImpression: this.diagnostic.diagnosticImpression,
      recommendations: this.diagnostic.recommendations,
    });
    if (this.isReadOnly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private clearMessages(): void {
    this.errorMsg = null;
    this.successMsg = null;
  }
}
