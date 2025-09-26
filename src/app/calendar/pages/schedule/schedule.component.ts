import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Modality } from '../../../studies/interfaces/modality.interface';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudySearch } from '../../../studies/interfaces/study-seaarch.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { AppointmenStatusService } from '../../../shared/services/appointment-status.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  public title: string = 'Detalle de consultas médicas';

  private service = inject(AppointmentService);
  private router = inject(Router);
  public modalities: Modality[] = [];
  public schedules: Schedule[] = [];
  private modalitySelected: string | null | undefined;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private medicalOfficeService = inject(MedicalOfficeService);
  private statusService = inject(AppointmenStatusService);


  public form: FormGroup = this.fb.group({
    date: [null],
    status: [''],
    accessionNumber: [null],
    patientName: [null],
  });
  
  ngOnInit(): void {
    this.loadMedicalOffice();
    this.setInitialFilter();
    this.getSchedule(this.form.value);
  }

  private loadMedicalOffice(): void {
    if (!this.authService.getMedicalOfficeStatus()) {
      this.medicalOfficeService.getLastByUserId(null).subscribe({
          next: (medicalOffice) => {
          if (medicalOffice && medicalOffice.id) {
            this.authService.selectMedicalOffice(medicalOffice.id);
          }
        }
      });
    }
  }

  private setInitialFilter(): void {
    this.form.patchValue({
      date: this.getToday()
    })
  }

  private getSchedule(search: StudySearch | null = null): void {
    this.service.getAllSchedule(search).subscribe(response => {
      this.schedules = response;
    });
  }

  onTimeSelected(hour: string, minute: string): void {
    const appointmentDate = this.form.get('date')?.value;

    this.router.navigate(['/appointments/new'], {
        queryParams: { 
          hour: hour, minute: minute, duration: 30,
          modality: this.modalitySelected,
          appointmentDate:  appointmentDate
        }
      });
  }

  cancel(appointmentId: string) {
    this.service.cancel(appointmentId).subscribe(() => {
      this.getSchedule(this.form.value);
    });
  }

  finished(appointmentId: string) {
    this.service.finished(appointmentId).subscribe(() => {
      this.getSchedule(this.form.value);
    });
  }

  confirmed(appointmentId: string) {
    this.service.confirmed(appointmentId).subscribe(() => {
      this.getSchedule(this.form.value);
    });
  }

  onCancel(scheduleId: string): void {
    Swal.fire({
      title: "¿Estas segunro de eliminar?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "¡Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteById(scheduleId).subscribe(() => {
          this.getSchedule(this.form.value);
        });
      }
    });
  }

  onSubmit(): void {
    if(!this.form.get('date')?.value) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingrese la fecha para filtrar.',
        icon: 'error'
      });
      return;
    }

    this.getSchedule(this.form.value);
  }

  getStatusName(statusCode: string | undefined): string {
    return statusCode ? this.statusService.getStatusName(statusCode) : '';
  }

  private getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

