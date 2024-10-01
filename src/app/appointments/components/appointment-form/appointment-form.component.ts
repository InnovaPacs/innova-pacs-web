import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentDto } from '../../interfaces/appointment.interface';
import { Patient } from '../../../patients/interfaces/patient.interface';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';
import { MedicalOffice } from '../../../medical-office/interfaces/medical-office.interface';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';

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

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  medicalOffices: MedicalOffice[] = [];
  
  id!: string;

  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    patientId: [null],
    doctorId: [null],
    medicalOfficeId: [null],
    appointmentStartHour: [null],
    appointmentEndHour: [null],
  });

  ngOnInit(): void {
    this.doctorService.getFullData().subscribe(repsosne => {
      this.doctors = repsosne;
    });

    this.patientService.getFullData().subscribe(response => {
      this.patients = response;
    });

    this.medicalOfficeService.getFullData().subscribe(response => {
      this.medicalOffices = response;
    });

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

  patchForm(response: Appointment) {
    console.log('VAlues :', response);
    this.form.patchValue({
      id: response.id,
      appointmentDate: response.appointmentDate,
      patientId: response.patient.id,
      doctorId: response.doctor.id,
      medicalOfficeId: response.medicalOffice.id,
      appointmentStartHour: response.appointmentStartHour,
      appointmentEndHour: response.appointmentEndHour,
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
      appointmentEndHour  } = this.form.value;

    return {
      id,
      appointmentDate,
      patientId,
      doctorId,
      medicalOfficeId,
      appointmentStartHour,
      appointmentEndHour
    };
  }

  onSubmit() {
    const data = this.getFormValue();
    console.log(':: Data:', data);
    if(this.id) {
      this.service.update(this.id, data).subscribe(reposne => {
        this.router.navigate(['/calendar/main']);
      });
    }

    if(!this.id) {
      this.service.save(data).subscribe(response => {
        this.router.navigate(['/calendar/main']);
      });
    }
  }
}
