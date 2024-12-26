import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { RadiolodyExamType } from '../../../radiology-exam/interfaces/radiology-exam-type.interface';
import { RadiologyExamService } from '../../../radiology-exam/services/radiology-exam.service';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  private service = inject(AppointmentService);
  private router = inject(Router);
  private radiologyExamService = inject(RadiologyExamService);
  public radiolodyExamTypes: RadiolodyExamType[] = [];
  public schedules: Schedule[] = [];
  private date?: string;
  private modalitySelected?: string;

  ngOnInit(): void {
    this.getRadiologyExams();
  }

  private getRadiologyExams() {
    this.radiologyExamService.getAllRadiologyExamType().subscribe(response => {
      this.radiolodyExamTypes = response;
    });
  }

  onSelectChange(event: Event) {

    this.modalitySelected = (event.target as HTMLSelectElement).value;
  
    if(this.date && this.modalitySelected) {
      this.getSchedule(this.date, this.modalitySelected);
    }
  }

  onDateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value; 
    this.date = selectedDate;
  
  }

  private getSchedule(date: string, modality: string) {
    this.service.getAllSchedule(date, modality).subscribe(response => {
      this.schedules = response;
    });
  }

  onTimeSelected(hour: string, minute: string): void {
    const radiolodyExamType = this.radiolodyExamTypes.find(ret => ret.id === this.modalitySelected);
    if(radiolodyExamType) {
      this.router.navigate(['/appointments/register'], {
        queryParams: { 
          hour: hour, minute: minute, 
          duration: radiolodyExamType['duration'], 
          modality: this.modalitySelected,
          appointmentDate:  this.date
        }
      });
    }
  }

  onDelete(scheduleId: string): void {
    Swal.fire({
      title: "¿Estas segunro de eliminar?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "¡Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteById(scheduleId).subscribe(() => {
          Swal.fire({
            title: "¡Elimiar!",
            text: "La cita fue eliminada.",
            icon: "success"
          });

          if(this.date && this.modalitySelected) {
            this.getSchedule(this.date, this.modalitySelected);
          }
        });
      }
    });
  }  
}
