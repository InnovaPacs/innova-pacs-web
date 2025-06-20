import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentDto } from '../../interfaces/appointment.interface';
import { Patient } from '../../../patients/interfaces/patient.interface';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { MedicalOffice } from '../../../medical-office/interfaces/medical-office.interface';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { Modality } from '../../../studies/interfaces/modality.interface';
import { ModalityType } from '../../../studies/interfaces/modality-type.interface';
import { StudyService } from '../../../studies/services/study.service';
import { AuthService } from '../../../auth/services/auth.service';
import { VendorsService } from '../../../shared/services/vendors.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(AppointmentService);
  private router = inject(Router);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);
  private medicalOfficeService = inject(MedicalOfficeService);
  private studyService = inject(StudyService);
  private auth = inject(AuthService)
  public title: string = 'Registrar cita médica';

  public patients: Patient[] = [];
  public doctors: Doctor[] = [];
  public medicalOffices: MedicalOffice[] = [];

  public modalitys: Modality[] =  [];
  public modalityType: ModalityType[] =  [];

  private modalityId?: string|null;
  private appointmentDate?: string|null;
  
  public id!: string;
  @ViewChild('modalityTypeIdRef') modalityTypeIdRef!: ElementRef;
  public modalityTypeInstance: any;
  @ViewChild('doctorRequestedRef') doctorRequestedRef!: ElementRef;
  public doctorRequestedInstance: any;
  @ViewChild('radiologistRef') radiologistRef!: ElementRef;
  public radiologistInstance: any;
  @ViewChild('patientRef', { static: false }) patientRef!: ElementRef<HTMLSelectElement>;
  public patientInstance: any;

  private vendorsService = inject(VendorsService);
  public showModal = false;
  public origing: string = 'appointment';
  public modalType!: string;


  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    patientId: [null],
    doctorRequestedId: [null],
    radiologistId: [null],
    medicalOfficeId: [null],
    modalityId: [null],
    modalityTypeId: [null],
    appointmentStartHour: [null],
    appointmentEndHour: [null],
    notes: [null]
  });

  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.getMainData();
    this.getPathParams();
    this.getQueryParams();
  }

  patchForm(response: Appointment) {
    this.form.patchValue({
      id: response.id,
      appointmentDate: response.appointmentDate,
      patientId: response.patient.id,
      doctorRequestedId: response.doctorRequested.id,
      radiologistId: response.radiologist.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentStartHour: response.appointmentStartHour,
      appointmentEndHour: response.appointmentEndHour,
      modality: response.modality.id,
      modalityTypeId: response.modalityType.id,
    });
  }

  getFormValue(): AppointmentDto {
    const { 
      id,
      appointmentDate,
      patientId,
      doctorRequestedId,
      radiologistId,
      medicalOfficeId,
      appointmentStartHour,
      appointmentEndHour,
      modalityId,
      modalityTypeId } = this.form.getRawValue();

    return {
      id,
      appointmentDate,
      patientId,
      doctorRequestedId,
      radiologistId,
      medicalOfficeId,
      appointmentStartHour,
      appointmentEndHour,
      modalityId,
      modalityTypeId
    };
  }

  onSubmit() {
    const data = this.getFormValue();
    console.log("Data ", data);

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/calendar/main']);
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/calendar/schedule'], {
          queryParams: {
            modality: this.modalityId,
            appointmentDate:  this.appointmentDate
          }
        });
      });
    }
  }

  getModalityData(): void {
    this.studyService.getAllModalieties().subscribe((data) => {
      this.modalitys = data;
    });
  }

  onSelectModality(selectModalityTypeId: any) {
    const selectedId = selectModalityTypeId?.target?.value ? selectModalityTypeId.target.value : selectModalityTypeId;
    this.studyService.getAllModalitiesType(selectedId).subscribe((data) => {
      this.modalityType = data;
      setTimeout(() => {
        this.vendorsService.initChoices(this.modalityTypeInstance, this.modalityTypeIdRef);
      }, 0);
    });
  }

  private getAppointmentDate(data: ParamMap):string| null {
    const date = data.get('appointmentDate');

    if(date) {
      return date;
    }

    return null;
  }

  private getModality(data: ParamMap):string| null {
    const modality = data.get('modality');

    if(modality) {
      this.onSelectModality(modality);
      return modality;
    }

    return null;
  }

  private getInitHour(data: ParamMap):string | null {
    const hour = data.get('hour');
    
    if(hour) {
      return `${parseInt(hour).toString().padStart(2, '0')}:${data.get('minute')}`;  
    }
    
    return null;
  }

  private getEndHour(data: ParamMap):string | null {
    const hour = data.get('hour');
    const minutes = data.get('minute');
    const duration = data.get('duration');
    
    if(hour && minutes && duration) {
      let currentHour =  parseInt(hour);
      let currentMinutes =  parseInt(minutes);
      let currentDuration =  parseInt(duration);
      let handleMinutes = (currentMinutes + currentDuration);

      if(handleMinutes === 60) {
        const newHour = currentHour + 1;
        const newMinutes = 0;
        return `${newHour.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      } else if(handleMinutes < 60) {
        return `${parseInt(hour).toString().padStart(2, '0')}:${handleMinutes.toString().padStart(2, '0')}`;
      }
    }
    
    return null;
  }

  private disableControl(controlName: string) {
    this.form.get(controlName)?.disable();
  }

  private getMainData(): void {
    this.getAllModalities();
    this.getAllDoctors();
    this.getAllPatients();
    this.getAllMedicalOffices();
  }

  private getAllMedicalOffices() {
    this.medicalOfficeService.getFullData().subscribe(response => {
      this.medicalOffices = response;
    });
  }

  private getAllModalities() {
    this.studyService.getAllModalieties().subscribe((data) => {
      this.modalitys = data;
    });
  }

  private getAllDoctors() {
    this.doctorService.getFullData().subscribe(repsosne => {
      this.doctors = repsosne;
      setTimeout(() => {
        this.doctorRequestedInstance = this.vendorsService.initChoices(this.doctorRequestedInstance, this.doctorRequestedRef);
        this.radiologistInstance = this.vendorsService.initChoices(this.radiologistInstance, this.radiologistRef);
      }, 0);
    });
  }

  private getAllPatients() {
    this.patientService.getFullData().subscribe(response => {
      this.patients = response;
      setTimeout(() => {
        this.patientInstance = this.vendorsService.initChoices(this.patientInstance, this.patientRef);
      }, 0);
    });
  }

  private getPathParams(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.service.getById(this.id);
      }),
      catchError(error => {
        return EMPTY;
      })
    ).subscribe(response => {
      this.patchForm(response);
    });
  }

  private getQueryParams() {
    this.route.queryParamMap.subscribe(data => {
      this.form.patchValue({
        appointmentStartHour: this.getInitHour(data),
        appointmentEndHour: this.getEndHour(data),
        modalityId: this.getModality(data),
        appointmentDate: this.getAppointmentDate(data),
        medicalOfficeId: this.getMedicalOffice(data),
      })

      this.modalityId = this.getModality(data);
      this.appointmentDate = this.getAppointmentDate(data);
    });

    this.disableControl('appointmentStartHour');
    this.disableControl('appointmentEndHour');
    this.disableControl('appointmentDate');
    this.disableControl('modalityId');
    this.disableControl('medicalOfficeId');
  }

  private getMedicalOffice(data: ParamMap):string| null {
    return this.auth.currentMedicalOfficeId();;
  }

  onSelectModalityType(selectModalityType: any) {
    console.log("modalityTypeId ", selectModalityType);
    const selectedId = selectModalityType?.target?.value ? selectModalityType.target.value : selectModalityType;
    const studySelected = this.modalityType.find(rds => rds.id === selectedId);
    this.form.patchValue({
      notes: studySelected!.instructions.replace(/\\n/g, '\n')
    });
  }

  public openModal(modalType: string) {
    this.showModal = true;
    this.modalType = modalType;
  }

  public closeModal() {
    this.showModal = false;
  }

  public handleNewPatient(patient: Patient) {
    this.patients = [...this.patients, patient];

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.patientInstance = this.vendorsService.initChoices(this.patientInstance, this.patientRef);
        this.doctorRequestedInstance = this.vendorsService.initChoices(this.patientInstance, this.patientRef);
        this.vendorsService.setChoices(this.doctorRequestedInstance, patient.id, `${patient.firstName} ${patient.lastName}`);
        this.form.patchValue({ patientId: patient.id });
        this.closeModal();
      }, 0);
    });
  }

  public handleNewDoctor(doctor: Doctor) {
    this.doctors = [...this.doctors, doctor];

    requestAnimationFrame(() => {
      setTimeout(() => {
        if(this.modalType === 'radiologist') {
          this.radiologistInstance = this.vendorsService.initChoices(this.radiologistInstance, this.radiologistRef);
          this.vendorsService.setChoices(this.radiologistInstance, doctor.id, `${doctor.name}`);
          this.form.patchValue({ radiologistId: doctor.id });
          this.closeModal();
        } else {
          this.doctorRequestedInstance = this.vendorsService.initChoices(this.doctorRequestedInstance, this.doctorRequestedRef);
          this.vendorsService.setChoices(this.doctorRequestedInstance, doctor.id, `${doctor.name}`);
          this.form.patchValue({ doctorRequestedId: doctor.id });
          this.closeModal();
        }
      }, 0);
    });
  }
}
