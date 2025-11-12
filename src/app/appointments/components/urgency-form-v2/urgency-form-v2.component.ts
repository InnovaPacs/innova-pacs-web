import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-urgency-form-v2',
  templateUrl: './urgency-form-v2.component.html',
  styleUrl: './urgency-form-v2.component.css',
})
export class UrgencyFormV2Component {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private vendorsService = inject(VendorsService);
  private studyService = inject(StudyService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private auth = inject(AuthService);

  patient: Patient | null = null;
  doctor: Doctor | null = null;

  public patients: Patient[] = [];
  public doctors: Doctor[] = [];
  public modalities: Modality[] = [];
  public modalityTypes: ModalityType[] = [];

  public patientInstance: any;
  public radiologistInstance: any;
  public modalityTypeInstance: any;
  public modalityInstance: any;

  @ViewChild('patientRef') patientRef!: ElementRef;
  @ViewChild('radiologistRef') radiologistRef!: ElementRef;
  @ViewChild('modalityIdRef') modalityIdRef!: ElementRef;
  @ViewChild('modalityTypeIdRef') modalityTypeIdRef!: ElementRef;

  public form: FormGroup = this.fb.group({
    id: [null],
    patientId: [null],
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
    this.loadDoctorsAndSelect('DOCTOR EN TURNO (ASIGNAR)');
    this.getModalitiesData();
    this.getQueryParams();
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
        switchMap(() => {
          return curp ? this.patientService.getByCurp(curp) : of(null);
        })
      )
      .subscribe((patient) => {
        this.patient = patient || null;
        if (this.patient) {
          this.vendorsService.setChoices(
            this.patientInstance,
            this.patient.id,
            `${this.patient.firstName} ${this.patient.lastName || ''}`
          );
          this.form.get('patientId')?.setValue(this.patient.id);
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
          }, 100);
        }),
        switchMap(() => {
          return name ? this.doctorService.getByName(name) : of(null);
        })
      )
      .subscribe((doctor) => {
        this.doctor = doctor || null;
        if (this.doctor) {
          this.vendorsService.setChoices(
            this.radiologistInstance,
            this.doctor.id,
            `${this.doctor.name}`
          );
          this.form.get('radiologistId')?.setValue(this.doctor.id);
        }
      });
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

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.modalityTypeInstance = this.vendorsService.initChoices(
          this.modalityTypeInstance,
          this.modalityTypeIdRef
        );
      }, 0);
    });
  }

  onSubmit() {
    console.log('Form Submitted', this.form.value);
    this.studyService
      .saveUrgencyAppointment(this.form.value as Appointment)
      .subscribe({
        next: (response) => {
          console.log('Appointment saved successfully', response);
        },
        error: (error) => {
          console.error('Error saving appointment', error);
        },
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
}
