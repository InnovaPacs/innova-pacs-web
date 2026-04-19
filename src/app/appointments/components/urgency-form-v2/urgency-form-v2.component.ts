import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PatientService } from '../../../patients/services/patient.service';
import { Patient } from '../../../patients/interfaces/patient.interface';
import { VendorsService } from '../../../shared/services/vendors.service';
import { lastValueFrom, of, switchMap, tap } from 'rxjs';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { ModalityType } from '../../../studies/interfaces/modality-type.interface';
import { Modality } from '../../../studies/interfaces/modality.interface';
import { StudyService } from '../../../studies/services/study.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../../interfaces/appointment.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-urgency-form-v2',
  templateUrl: './urgency-form-v2.component.html',
  styleUrl: './urgency-form-v2.component.css',
  standalone: false,
})
export class UrgencyFormV2Component {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private vendorsService = inject(VendorsService);
  private studyService = inject(StudyService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private auth = inject(AuthService);
  private router = inject(Router);

  public showModal = false;
  public modalType!: string;
  public origing: string = 'appointment';

  patient: Patient | null = null;
  doctor: Doctor | null = null;

  public patients: Patient[] = [];
  public doctors: Doctor[] = [];
  public modalities: Modality[] = [];
  public modalityTypes: ModalityType[] = [];

  public patientInstance: any;
  public radiologistInstance: any;
  public assignedRadiologistInstance: any;
  public modalityTypeInstance: any;
  public modalityInstance: any;
  public doctorRequestedInstance: any;

  @ViewChild('patientRef') patientRef!: ElementRef;
  @ViewChild('radiologistRef') radiologistRef!: ElementRef;
  @ViewChild('assignedRadiologistRef') assignedRadiologistRef!: ElementRef;
  @ViewChild('modalityIdRef') modalityIdRef!: ElementRef;
  @ViewChild('modalityTypeIdRef') modalityTypeIdRef!: ElementRef;
  @ViewChild('doctorRequestedRef') doctorRequestedRef!: ElementRef;

  public form: FormGroup = this.fb.group({
    id: [null],
    patientId: [null],
    requestingDoctorId: [null],
    radiologistId: [null],
    modalityId: [null],
    modalityTypeId: [null],
    appointmentStartHour: [null],
    appointmentEndHour: [null],
    appointmentDate: [null],
    medicalOfficeId: [null],
  });

  ngOnInit() {
    this.loadPatientsAndSelect('DESCONOCIDO');
    this.loadDoctorsAndSelect('MÉDICO SOLICITANTE');
    this.getModalitiesData();
    this.getQueryParams();
  }

  getModalitiesData(): void {
    this.studyService.getAllModalieties().subscribe((data) => {
      this.modalities = data;
      setTimeout(() => {
        this.vendorsService.initChoices(
          this.modalityInstance,
          this.modalityIdRef
        );
      }, 0);
    });
  }

  async onSelectModality(selectModalityId: any) {
    const selectedId = selectModalityId.target.value;
    this.form.get('modalityTypeId')?.setValue(null);

    const data = await lastValueFrom(
      this.studyService.getAllModalitiesType(selectedId)
    );

    this.modalityTypes = data;

    this.modalityTypeInstance = this.vendorsService.initChoices(
      this.modalityTypeInstance,
      this.modalityTypeIdRef
    );

    this.modalityTypes.map((modality) => {
      this.vendorsService.setChoicesForSelect(
        this.modalityTypeInstance,
        modality.id,
        modality.name
      );
    });
  }

  onSubmit() {
    this.studyService
      .saveUrgencyAppointment(this.form.value as Appointment)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/calendar/schedule']);
        },
        error: () => {},
      });
  }

  private getQueryParams() {
    this.route.queryParamMap.subscribe((data) => {
      this.form.patchValue({
        appointmentStartHour: this.getInitHour(data),
        appointmentEndHour: this.getEndHour(data),
        appointmentDate: this.getAppointmentDate(data),
        medicalOfficeId: this.getMedicalOffice(),
      });
    });
  }

  private getInitHour(data: ParamMap): string | null {
    const hour = data.get('hour');

    if (hour) {
      return `${parseInt(hour).toString().padStart(2, '0')}:${data.get('minute')}`;
    }

    return null;
  }

  private getEndHour(data: ParamMap): string | null {
    const hour = data.get('hour');
    const minutes = data.get('minute');
    const duration = data.get('duration');

    if (hour && minutes && duration) {
      let currentHour = parseInt(hour);
      let currentMinutes = parseInt(minutes);
      let currentDuration = parseInt(duration);
      let handleMinutes = currentMinutes + currentDuration;

      if (handleMinutes === 60) {
        const newHour = currentHour + 1;
        const newMinutes = 0;
        return `${newHour.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      } else if (handleMinutes < 60) {
        return `${parseInt(hour).toString().padStart(2, '0')}:${handleMinutes.toString().padStart(2, '0')}`;
      }
    }

    return null;
  }

  private getAppointmentDate(data: ParamMap): string | null {
    const date = data.get('appointmentDate');

    if (date) {
      return date;
    }

    return null;
  }

  private getMedicalOffice(): string | null {
    return this.auth.currentMedicalOfficeId();
  }

  public openModal(modalType: string): void {
    this.showModal = true;
    this.modalType = modalType;
  }

  public closeModal(): void {
    this.showModal = false;
  }

  public handleNewPatient(patient: Patient): void {
    this.patients = [...this.patients, patient];
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.patientInstance = this.vendorsService.initChoices(
          this.patientInstance,
          this.patientRef
        );
        this.vendorsService.setChoices(
          this.patientInstance,
          patient.id,
          `${patient.firstName} ${patient.lastName || ''}`
        );
        this.form.patchValue({ patientId: patient.id });
        this.closeModal();
      }, 100);
    });
  }

  public handleNewDoctor(doctor: Doctor): void {
    this.doctors = [...this.doctors, doctor];
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.radiologistInstance = this.vendorsService.initChoices(
          this.radiologistInstance,
          this.radiologistRef
        );
        this.vendorsService.setChoices(
          this.radiologistInstance,
          doctor.id,
          `${doctor.name}`
        );
        this.form.patchValue({ requestingDoctorId: doctor.id });
        this.closeModal();
      }, 100);
    });
  }

  private loadPatientsAndSelect(curp: string) {
    this.patientService
      .getFullData()
      .pipe(
        tap((response) => {
          this.patients = response;
          setTimeout(() => {
            this.patientInstance = this.vendorsService.initChoices(
              this.patientInstance,
              this.patientRef
            );
          }, 100);
        }),
        switchMap(() => (curp ? this.patientService.getByCurp(curp) : of(null)))
      )
      .subscribe((patient) => {
        this.patient = patient || null;
        if (this.patient) {
          setTimeout(() => {
            this.vendorsService.setChoices(
              this.patientInstance,
              this.patient!.id,
              `${this.patient!.firstName} ${this.patient!.lastName || ''}`
            );
            this.form.get('patientId')?.setValue(this.patient!.id);
          }, 150);
        }
      });
  }

  private loadDoctorsAndSelect(name: string) {
    this.doctorService
      .getFullData()
      .pipe(
        tap((response) => {
          this.doctors = response;
          setTimeout(() => {
            this.radiologistInstance = this.vendorsService.initChoices(
              this.radiologistInstance,
              this.radiologistRef
            );
            this.assignedRadiologistInstance = this.vendorsService.initChoices(
              this.assignedRadiologistInstance,
              this.assignedRadiologistRef
            );
          }, 100);
        }),
        switchMap(() => (name ? this.doctorService.getByName(name) : of(null)))
      )
      .subscribe((doctor) => {
        this.doctor = doctor || null;
        if (this.doctor) {
          setTimeout(() => {
            this.vendorsService.setChoices(
              this.radiologistInstance,
              this.doctor!.id,
              `${this.doctor!.name}`
            );
            this.form.get('requestingDoctorId')?.setValue(this.doctor!.id);
          }, 150);
        }
      });
  }

  public handleNewAssignedDoctor(doctor: Doctor): void {
    this.doctors = [...this.doctors, doctor];
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.assignedRadiologistInstance = this.vendorsService.initChoices(
          this.assignedRadiologistInstance,
          this.assignedRadiologistRef
        );
        this.vendorsService.setChoices(
          this.assignedRadiologistInstance,
          doctor.id,
          `${doctor.name}`
        );
        this.form.patchValue({ radiologistId: doctor.id });
        this.closeModal();
      }, 100);
    });
  }
}
