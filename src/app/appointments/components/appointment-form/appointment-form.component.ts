import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { MedicalOffice } from '../../../medical-office/interfaces/medical-office.interface';
import { AppointmentService } from '../../services/appointment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Appointment, AppointmentDto } from '../../interfaces/appointment.interface';
import { Patient } from '../../../patients/interfaces/patient.interface';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { catchError, EMPTY, filter, map, switchMap } from 'rxjs';
import { VendorsService } from '../../../shared/services/vendors.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {
  private service = inject(AppointmentService);
  private medicalOfficeService = inject(MedicalOfficeService);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);
  private auth = inject(AuthService)

  public showModal = false;
  public modalType!: string;

  public patients: Patient[] = [];
  public doctors: Doctor[] = [];
  public medicalOffices: MedicalOffice[] = [];
  public id!: string;

  
  private modalityId?: string|null;
  private appointmentDate?: string|null;
  
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private vendorsService = inject(VendorsService);
  

  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    appointmentStartHour: [null],
    appointmentEndHour: [null],
    patientId: [null],
    doctorRequestedId: [null],
    medicalOfficeId: [null]
  });

  @ViewChild('doctorRequestedRef') doctorRequestedRef!: ElementRef;
  public doctorRequestedInstance: any;
  @ViewChild('patientRef', { static: false }) patientRef!: ElementRef<HTMLSelectElement>;
  public patientInstance: any;

  ngOnInit(): void {
    this.getMainData();
    this.getPathParams();
    this.getQueryParams();
  }

  private getQueryParams() {
    this.route.queryParamMap.subscribe(data => {
      this.form.patchValue({
        appointmentStartHour: this.getInitHour(data),
        appointmentEndHour: this.getEndHour(data),
        appointmentDate: this.getAppointmentDate(data),
        medicalOfficeId: this.getMedicalOffice(data),
      })

      this.appointmentDate = this.getAppointmentDate(data);
    });

    this.disableControl('appointmentStartHour');
    this.disableControl('appointmentEndHour');
    this.disableControl('appointmentDate');
    this.disableControl('medicalOfficeId');
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

  private getMainData(): void {
    this.getAllDoctors();
    this.getAllPatients();
    this.getAllMedicalOffices();
  }

  private getAllMedicalOffices() {
    this.medicalOfficeService.getFullData().subscribe(response => {
      this.medicalOffices = response;
    });
  }

  private getAllDoctors() {
    this.doctorService.getFullData().subscribe(repsosne => {
      this.doctors = repsosne;
      setTimeout(() => {
        this.doctorRequestedInstance = this.vendorsService.initChoices(this.doctorRequestedInstance, this.doctorRequestedRef);
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

  onSubmit() {
    const data = this.getFormValue();

    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/calendar/main']);
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        /*
        this.router.navigate(['/calendar/schedule'], {
          queryParams: {
            modality: this.modalityId,
            appointmentDate:  this.appointmentDate
          }
        });*/
      });
    }
  }

  getFormValue(): AppointmentDto {
    const { 
      id,
      appointmentDate,
      appointmentStartHour,
      appointmentEndHour,
      patientId,
      doctorRequestedId,
      medicalOfficeId } = this.form.getRawValue();

    return {
      id,
      appointmentDate,
      appointmentStartHour,
      appointmentEndHour,
      patientId,
      doctorRequestedId,
      medicalOfficeId
    };
  }

  public openModal(modalType: string) {
    this.showModal = true;
    this.modalType = modalType;
  }

  private disableControl(controlName: string) {
    this.form.get(controlName)?.disable();
  }

  patchForm(response: Appointment) {
    this.form.patchValue({
      id: response.id,
      appointmentDate: response.appointmentDate,
      appointmentStartHour: response.appointmentStartHour,
      appointmentEndHour: response.appointmentEndHour,
      patientId: response.patient.id,
      doctorRequestedId: response.doctorRequested.id,
      medicalOfficeId: response.medicalOffice.id
    });
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

  private getAppointmentDate(data: ParamMap):string| null {
    const date = data.get('appointmentDate');

    if(date) {
      return date;
    }

    return null;
  }

  private getMedicalOffice(data: ParamMap):string| null {
    return this.auth.currentMedicalOfficeId();;
  }
}
