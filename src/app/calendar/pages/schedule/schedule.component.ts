import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { RadiolodyExamType } from '../../../radiology-exam/interfaces/radiology-exam-type.interface';
import { RadiologyExamService } from '../../../radiology-exam/services/radiology-exam.service';
import { Schedule } from '../../../appointments/interfaces/appointment-schedule.interface';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  private service = inject(AppointmentService);
  private router = inject(Router);
  private radiologyExamService = inject(RadiologyExamService);
  public radiolodyExamTypes:RadiolodyExamType[] = [];
  public schedules: Schedule[] = [];

  ngOnInit(): void {
    this.radiologyExamService.getAllRadiologyExamType().subscribe(response => {
      this.radiolodyExamTypes = response;
    });
  }

  onSelectChange(event: Event) {

    const selectedId = (event.target as HTMLSelectElement).value;
    const domainSelected = this.radiolodyExamTypes.find( domain => domain.id === selectedId);
    console.log('Selected radiology exam type ID:', domainSelected);
    console.log('Duración:', domainSelected?.duration);

  
    this.service.getAllSchedule(12, 2024, selectedId).subscribe(response => {
      this.schedules = response;
    });
  }
}
