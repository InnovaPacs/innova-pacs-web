import { Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { Study, StudyDto } from '../../interfaces/study.interface';
import { StudyService } from '../../services/study.service';
import { Modality } from '../../interfaces/modality.interface';
import { ModalityType } from '../../interfaces/modality-type.interface';
import { VendorsService } from '../../../shared/services/vendors.service';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Patient } from '../../../patients/interfaces/patient.interface';
import { PatientService } from '../../../patients/services/patient.service';

@Component({
  selector: 'app-study-form',
  templateUrl: './study-form.component.html',
  styleUrl: './study-form.component.css'
})
export class StudyFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(StudyService);
  private vendorsService = inject(VendorsService);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);

  public id!: string;
  @Input() 
  public appointmentId!: string;

  public form: FormGroup = this.fb.group({
    id: [null],
    modalityId: [null],
    examDate: [null],
    status: [null],
    result: [null],
    patientId: [null],
    medicalOfficeId: [null],
    appointmentId: [this.appointmentId],
    modalityTypeId: [null],
    radiologistId: [null]
  });

  public modalities: Modality[] =  [];
  public modalityTypes: ModalityType[] =  [];
  public doctors: Doctor[] = [];
  public patients: Patient[] = [];
  public studies: Study[] = [];

  @ViewChild('modalityTypeIdRef') modalityTypeIdRef!: ElementRef;
  public modalityTypeInstance: any;
  @ViewChild('modalityIdRef') modalityIdRef!: ElementRef;
  public modalityInstance: any;
  @ViewChild('radiologistRef') radiologistRef!: ElementRef;
  public radiologistInstance: any;
  @ViewChild('patientRef', { static: false }) patientRef!: ElementRef<HTMLSelectElement>;
  public patientInstance: any;
  
  public showModal = false;
  public modalType!: string;
  public origing: string = 'appointment';

  ngOnInit(): void {
    this.getData();
    this.getModalitiesData();
    this.getAllDoctors();
    this.getAllPatients();
    this.getAllStudies(this.appointmentId);
  }

  patchForm(response: Study) {
    this.form.patchValue({
      id: response.id,
      examDate: response.examDate,
      status: response.status,
      result: response.result,
      patientId: response.patient.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentId: response.appointment.id,
      radiologistId: response.radiologist.id
    });

    if(response!.modality) {
      this.form.patchValue({
        modalityId: response.modality.id
      });
    }

    if(response!.modalityType) {
      this.form.patchValue({
        modalityTypeId: response.modalityType.id
      });
    }
  }

  getFormValue(): StudyDto {
    const { id, modalityId, examDate, status, result, patientId, medicalOfficeId, appointmentId, modalityTypeId, radiologistId } = this.form.value;

    return {
      id, modalityId, examDate, status, result, patientId, medicalOfficeId, appointmentId, modalityTypeId, radiologistId
    };
  }

  onSubmit() {
    const data = this.getFormValue();
    data.appointmentId = this.appointmentId;

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        //this.router.navigate(['/radiology-exams/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.getAllStudies(response.id);
        //this.router.navigate(['/studies/main'], { queryParams: { appointmentId: this.appointmentId } });
      });
    }
  }

  getModalitiesData(): void {
    this.service.getAllModalieties().subscribe((data) => {
      this.modalities = data;
      setTimeout(() => {
        this.vendorsService.initChoices(this.modalityInstance, this.modalityIdRef);
      }, 0);
    });
  }

  getData(): void {
    this.route.queryParamMap.pipe(
      map(queryParams => queryParams.get('appointmentId')),
      catchError(error => {
        return EMPTY;
      })
    ).subscribe(appointmentId => {
      this.appointmentId = appointmentId!;
      this.form.patchValue({
        appointmentId: appointmentId
      });
    });

    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.service.getById(this.id);
      }),
      catchError(error => {
        console.error('Error al obtener el consultorio:', error);
        return EMPTY;
      })
    ).subscribe(response => {
      this.patchForm(response);
    });
  }

  onSelectModality(selectModalityId: any) {
    const selectedId = selectModalityId.target.value;    
    this.service.getAllModalitiesType(selectedId).subscribe((data) => {
      this.modalityTypes = data;
      setTimeout(() => {
        this.vendorsService.initChoices(this.modalityTypeInstance, this.modalityTypeIdRef);
      }, 0);
    });
  }

  private getAllDoctors() {
    this.doctorService.getFullData().subscribe(repsosne => {
      this.doctors = repsosne;
      setTimeout(() => {
        this.radiologistInstance = this.vendorsService.initChoices(this.radiologistInstance, this.radiologistRef);
      }, 0);
    });
  }

  private getAllStudies(appointmentId: string) {
    if(appointmentId) {
      this.service.getAllStudies(this.appointmentId).subscribe(repsosne => {
      this.studies = repsosne;
      console.log(this.studies);
    });
    }
  }

  public openModal(modalType: string) {
    this.showModal = true;
    this.modalType = modalType;
  }

  public closeModal() {
    this.showModal = false;
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
        }
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

  public handleNewPatient(patient: Patient) {
    this.patients = [...this.patients, patient];

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.patientInstance = this.vendorsService.initChoices(this.patientInstance, this.patientRef);
        this.vendorsService.setChoices(this.patientInstance, patient.id, `${patient.firstName} ${patient.lastName}`);
        this.form.patchValue({ patientId: patient.id });
        this.closeModal();
      }, 0);
    });
  }
}
