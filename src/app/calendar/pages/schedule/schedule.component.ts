import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Modality } from '../../../studies/interfaces/modality.interface';
import { StudyService } from '../../../studies/services/study.service';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendorsService } from '../../../shared/services/vendors.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  public title: string = 'Detalle de consultas medicas';

  @ViewChild('appointmentDate', { static: false }) appointmentDate!: ElementRef;
  startDatepickerInstance: any;

  private service = inject(AppointmentService);
  private router = inject(Router);
  private studyService = inject(StudyService);
  public modalities: Modality[] = [];
  public schedules: Schedule[] = [];
  private date: string | null | undefined;
  private modalitySelected: string | null | undefined;
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private vendorsService = inject(VendorsService);

  public form: FormGroup = this.fb.group({
    appointmentDate: [null],
    modalityId: [null]
  });
  
  ngOnInit(): void {
    this.getModalities();
    this.getQueryParams();
  }

  private getModalities() {
    this.studyService.getAllModalieties().subscribe(response => {
      this.modalities = response;
      setTimeout(() => {
        this.vendorsService.initFlatpickr(this.startDatepickerInstance, this.appointmentDate);
      }, 0);
    });
  }

  onSelectChange(event: Event) {
    this.modalitySelected = (event.target as HTMLSelectElement).value;
  
    if(this.date && this.modalitySelected) {
      this.getSchedule(this.date);
    }
  }

  onDateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value; 
    this.date = selectedDate;

    if(this.date) {
      this.getSchedule(this.date);
    }
  }

  private getSchedule(date: string) {
    this.service.getAllSchedule(date).subscribe(response => {
      this.schedules = response;
    });
  }

  onTimeSelected(hour: string, minute: string): void {
    this.router.navigate(['/appointments/new'], {
        queryParams: { 
          hour: hour, minute: minute,
          modality: this.modalitySelected,
          appointmentDate:  this.date
        }
      });
  }

  cancel(appointmentId: string) {
    this.service.cancel(appointmentId).subscribe(() => {
      if(this.date && this.modalitySelected) {
        this.getSchedule(this.date);
      }
    });
  }

  finished(appointmentId: string) {
    this.service.finished(appointmentId).subscribe(() => {
          
      if(this.date && this.modalitySelected) {
        this.getSchedule(this.date);
      }
    });
  }

    confirmed(appointmentId: string) {
    this.service.confirmed(appointmentId).subscribe(() => {
          
      if(this.date && this.modalitySelected) {
        this.getSchedule(this.date);
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
          if(this.date && this.modalitySelected) {
            this.getSchedule(this.date);
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
          modalityId: this.modalitySelected
        });
        
        this.getSchedule(this.date);
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

