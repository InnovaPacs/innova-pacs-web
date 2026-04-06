import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  filter,
  firstValueFrom,
  map,
  switchMap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Study } from '../../interfaces/study.interface';
import {
  Diagnostic,
  DiagnosticDto,
} from '../../interfaces/diagnostic.interface';
import { DiagnosticService } from '../../services/diagnostic.service';
import { StudyService } from '../../services/study.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { StudyStatusService } from '../../../shared/services/study-status.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';

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
  public studyStatusService = inject(StudyStatusService);
  private readonly destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  public study: Study | null = null;
  public diagnostic: Diagnostic | null = null;
  public doctors: Doctor[] = [];
  public studyId!: string;

  public form: FormGroup = this.fb.group({
    doctorId: [null, Validators.required],
    clinicalInfo: ['', Validators.required],
    technique: ['', Validators.required],
    findings: ['', Validators.required],
    diagnosticImpression: ['', Validators.required],
    recommendations: [''],
  });

  async ngOnInit(): Promise<void> {
    this.getData();
    this.getDoctors();
  }

  private getDoctors(): void {
    this.doctorService
      .getFullData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.doctors = response;
          console.log('Doctores obtenidos:', this.doctors);
          console.log(
            'Doctores obtenidos:',
            this.authService.currentUser()!.id
          );
          this.doctors.map((doctor) => {
            if (doctor.userId === this.authService.currentUser()!.id) {
              console.log('Doctor encontrado:', doctor);
              this.form.patchValue({ doctorId: doctor.id });
            }
          });
        },
        error: (err) => this.handleError(err),
      });
  }

  private getData(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('studyId')),
        filter((id) => !!id),
        switchMap((id) => {
          this.studyId = id!;
          return this.studyService.getById(this.studyId);
        }),
        catchError(() => EMPTY)
      )
      .subscribe((response) => {
        this.study = response;
        this.diagnosticService
          .getByStudyId(this.studyId)
          .subscribe((diagnostic) => {
            this.diagnostic = diagnostic;
            this.patchForm(diagnostic);
          });
      });
  }

  getStatusName(statusCode: string | undefined): string {
    return statusCode ? this.studyStatusService.getStatusName(statusCode) : '';
  }

  patchForm(response: Diagnostic) {
    this.form.patchValue({
      doctorId: response.doctor.id,
      clinicalInfo: response.clinicalInfo,
      technique: response.technique,
      findings: response.findings,
      diagnosticImpression: response.diagnosticImpression,
      recommendations: response.recommendations,
    });
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }

    const data = this.getFormValue();
    if (this.diagnostic) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  handleUpdate(update: DiagnosticDto): void {
    this.diagnosticService
      .update(this.study!.id, update)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.onDiagnosticSaved(response),
        error: (err) => this.handleError(err),
      });
  }

  private onDiagnosticSaved(response: Diagnostic): void {
    this.diagnostic = response;
    this.patchForm(this.diagnostic);
  }

  private handleError(err: unknown): void {
    console.error(err);
    // mostrar toast/snackbar al usuario
  }

  handleCreate(update: DiagnosticDto): void {
    this.diagnosticService
      .save(this.studyId, update)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.onDiagnosticSaved(response),
        error: (err) => this.handleError(err),
      });
  }

  getFormValue(): DiagnosticDto {
    const {
      doctorId,
      clinicalInfo,
      technique,
      findings,
      diagnosticImpression,
      recommendations,
    } = this.form.value;

    return {
      doctorId,
      clinicalInfo,
      technique,
      findings,
      diagnosticImpression,
      recommendations,
    } as DiagnosticDto;
  }

  public downloadPdf(studyId: string): void {
    if (!this.diagnostic) return;

    this.diagnosticService.openPdf(studyId).catch((error) => {
      console.error('Error al descargar el PDF:', error);
      alert('No se pudo descargar el PDF. Intenta de nuevo más tarde.');
    });
  }
}
