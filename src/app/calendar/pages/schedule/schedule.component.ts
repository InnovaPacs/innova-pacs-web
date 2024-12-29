import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { RadiolodyExamType } from '../../../radiology-exam/interfaces/radiology-exam-type.interface';
import { RadiologyExamService } from '../../../radiology-exam/services/radiology-exam.service';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  private date: string | null | undefined;
  private modalitySelected: string | null | undefined;
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    radiologyExamTypeId: [null]
  });
  
  ngOnInit(): void {
    this.getRadiologyExams();
    this.getQueryParams();
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

  onCancel(scheduleId: string): void {
    Swal.fire({
      title: "¿Estas segunro de cancelar?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "¡Si, cancelar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.cancelById(scheduleId).subscribe(() => {
          Swal.fire({
            title: "Cancelar!",
            text: "La cita fue cancelada.",
            icon: "success"
          });

          if(this.date && this.modalitySelected) {
            this.getSchedule(this.date, this.modalitySelected);
          }
        });
      }
    });
  }

  private getQueryParams() {
    this.route.queryParamMap.subscribe(data => {
      this.modalitySelected = this.getModality(data);
      this.date = this.getAppointmentDate(data);
      
      if(this.date && this.modalitySelected) {
        this.form.patchValue({
          appointmentDate: this.date,
          radiologyExamTypeId: this.modalitySelected
        });
        
        this.getSchedule(this.date, this.modalitySelected);
      }
    });
  }

  private getModality(data: ParamMap):string| null {
    return  data.get('modality');;
  }

  private getAppointmentDate(data: ParamMap):string| null {
    return data.get('appointmentDate');;
  }
}
