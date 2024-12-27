import { Component, Inject, inject } from '@angular/core';
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
import { RadiolodyExamType } from '../../../radiology-exam/interfaces/radiology-exam-type.interface';
import { RadiolodyExamStudy } from '../../../radiology-exam/interfaces/radiology-exam-study.interface';
import { RadiologyExamService } from '../../../radiology-exam/services/radiology-exam.service';

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
  private radiologyExamService = inject(RadiologyExamService);

  public patients: Patient[] = [];
  public doctors: Doctor[] = [];
  public medicalOffices: MedicalOffice[] = [];

  public radiologyExamTypes: RadiolodyExamType[] =  [];
  public radiologyExamStudy: RadiolodyExamStudy[] =  [];

  private radiologyExamTypeId?: string|null;
  private appointmentDate?: string|null;
  
  id!: string;

  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    patientId: [null],
    doctorId: [null],
    medicalOfficeId: [null],
    radiologyExamTypeId: [null],
    radiologyExamStudyId: [null],
    appointmentStartHour: [null],
    appointmentEndHour: [null],
  });

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
      doctorId: response.doctor.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentStartHour: response.appointmentStartHour,
      appointmentEndHour: response.appointmentEndHour,
      radiologyExamType: response.radiologyExamType.id,
      radiologyExamStudy: response.radiologyExamStudy.id,
    });
  }

  getFormValue(): AppointmentDto {
    const { 
      id,
      appointmentDate,
      patientId,
      doctorId,
      medicalOfficeId,
      appointmentStartHour,
      appointmentEndHour,
      radiologyExamTypeId,
      radiologyExamStudyId } = this.form.getRawValue();

    return {
      id,
      appointmentDate,
      patientId,
      doctorId,
      medicalOfficeId,
      appointmentStartHour,
      appointmentEndHour,
      radiologyExamTypeId,
      radiologyExamStudyId
    };
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
        this.router.navigate(['/calendar/schedule'], {
          queryParams: {
            modality: this.radiologyExamTypeId,
            appointmentDate:  this.appointmentDate
          }
        });
      });
    }
  }

  getRadiologyExamData(): void {
    this.radiologyExamService.getAllRadiologyExamType().subscribe((data) => {
      this.radiologyExamTypes = data;
    });
  }

  onSelectRadiologyExamType(selectRadiologyExamTypeId: any) {
    const selectedId = selectRadiologyExamTypeId?.target?.value ? selectRadiologyExamTypeId.target.value : selectRadiologyExamTypeId;
    this.radiologyExamService.getAllRadiologyExamStudy(selectedId).subscribe((data) => {
      this.radiologyExamStudy = data;
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
      this.onSelectRadiologyExamType(modality);
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
    this.radiologyExamService.getAllRadiologyExamType().subscribe((data) => {
      this.radiologyExamTypes = data;
    });

    this.doctorService.getFullData().subscribe(repsosne => {
      this.doctors = repsosne;
    });

    this.patientService.getFullData().subscribe(response => {
      this.patients = response;
    });

    this.medicalOfficeService.getFullData().subscribe(response => {
      this.medicalOffices = response;
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
        radiologyExamTypeId: this.getModality(data),
        appointmentDate: this.getAppointmentDate(data)
      })

      this.radiologyExamTypeId = this.getModality(data);
      this.appointmentDate = this.getAppointmentDate(data);
    });

    this.disableControl('appointmentStartHour');
    this.disableControl('appointmentEndHour');
    this.disableControl('appointmentDate');
    this.disableControl('radiologyExamTypeId');
  }
}
