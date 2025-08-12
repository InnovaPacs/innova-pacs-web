import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Modality } from '../../../studies/interfaces/modality.interface';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudySearch } from '../../../studies/interfaces/study-seaarch.interface';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  public title: string = 'Detalle de consultas medicas';

  private service = inject(AppointmentService);
  private router = inject(Router);
  public modalities: Modality[] = [];
  public schedules: Schedule[] = [];
  private modalitySelected: string | null | undefined;
  private fb = inject(FormBuilder);


  public form: FormGroup = this.fb.group({
    date: [null],
    status: [''],
    accessionNumber: [null],
    patientName: [null],
  });
  
  ngOnInit(): void {
    
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
      if(this.form.get('date')?.value) {
        this.getSchedule(this.form.get('date')?.value);
      }
    });
  }

  finished(appointmentId: string) {
    this.service.finished(appointmentId).subscribe(() => {
          
      if(this.form.get('date')?.value) {
        this.getSchedule(this.form.get('date')?.value);
      }
    });
  }

  confirmed(appointmentId: string) {
    this.service.confirmed(appointmentId).subscribe(() => {
      
      if(this.form.get('date')?.value) {
        this.getSchedule(this.form.get('date')?.value);
      }
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
          if(this.form.get('date')?.value) {
            this.getSchedule(this.form.get('date')?.value);
          }
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
}

