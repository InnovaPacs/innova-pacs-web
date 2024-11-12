import { Component, inject, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { map } from 'rxjs';
import { Appointment, AppointmentFullData } from '../../../appointments/interfaces/appointment.interface';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { RadiologyExamService } from '../../../radiology-exam/services/radiology-exam.service';
import { RadiolodyExamType } from '../../../radiology-exam/interfaces/radiology-exam-type.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  private service = inject(AppointmentService);
  private router = inject(Router);
  private radiologyExamService = inject(RadiologyExamService);
  private currentMonth: number = 0;
  private currentYear: number = 0;
  public radiolodyExamTypes:RadiolodyExamType[] = [];
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, bootstrapPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,listMonth,listWeek,listDay'
    },
    locale: 'es',
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    buttonText: {
      today:    'Hoy',
      month:    'Mes',
      week:     'Semana',
      day:      'Día',
      listMonth: 'Lista Mes',
      listWeek:  'Lista Semana',
      listDay:   'Lista Día'
    },
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDatesSet.bind(this)
  };

  public calendarEvents: CalendarEvent[] = [];
  public appointments: AppointmentFullData[] = [];

  handleEventClick(arg:any) {
    const eventId = arg.event.id;
    this.openModal(eventId);
  }

  ngOnInit(): void {
    this.radiologyExamService.getAllRadiologyExamType().subscribe(response => {
      this.radiolodyExamTypes = response;
    });
  }

  openModal(eventId: string) {
    const appointment = this.appointments.filter(event => event.id === eventId)[0];
    console.log('this.appointments ', this.appointments);
    console.log('this.appointments ', appointment);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      }, buttonsStyling: false});


      swalWithBootstrapButtons.fire({
        title: '¿Qué deseas hacer?',
        text: 'Selecciona una opción:',
        icon: 'question',
        html: `
           <div style="text-align: left; margin-bottom: 15px;">
      <table class="table">
        <tr>
          <th>Fecha de Cita:</th>
          <td>${appointment.appointmentDate}</td>
        </tr>
        <tr>
          <th>Hora de Cita:</th>
          <td>${appointment.appointmentStartHour}-${appointment.appointmentEndHour}</td>
        </tr>
        <tr>
          <th>Estado:</th>
          <td>${appointment.status}</td>
        </tr>
        <tr>
          <th>Paciente:</th>
          <td>${appointment.patientFirstName}</td>
        </tr>
        <tr>
          <th>Doctor:</th>
          <td>${appointment.doctorName}</td>
        </tr>
        <tr>
          <th>Consultorio Médico:</th>
          <td>${appointment.medicalOfficeName}</td>
        </tr>
        <tr>
          <th>Tipo de Examen:</th>
          <td> <span style="color: ${appointment.examTypeColor};">${appointment.examTypeName ? appointment.examTypeName: ''}</td>
        </tr>
        <tr>
          <th>Descripción del Examen:</th>
          <td>${appointment.examTypeDescription ? appointment.examTypeDescription : ''}</td>
        </tr>
      </table>
    </div>
          <button id="editBtn" class="btn btn-primary" style="margin-right: 10px;">Editar</button>
          <button id="deleteBtn" class="btn btn-danger" style="margin-right: 10px;">Eliminar</button>
          <button id="addStudyBtn" class="btn btn-success" style="margin-right: 10px;">Ver estudio</button>
        `,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        showCloseButton: true,
        didRender: () => {
          const editBtn = document.getElementById('editBtn');
          const deleteBtn = document.getElementById('deleteBtn');
          const addStudyBtn = document.getElementById('addStudyBtn');
      
          editBtn!.addEventListener('click', () => {
            swalWithBootstrapButtons.close();
            this.editAction(eventId);
          });
      
          deleteBtn!.addEventListener('click', () => {
            swalWithBootstrapButtons.close();
            this.deleteAction(eventId);
          });

          addStudyBtn!.addEventListener('click', () => {
            swalWithBootstrapButtons.close();
            this.addStudy(eventId);
          });
        }
      });
      
  }

  editAction(eventId: string) {
    this.router.navigate(['/appointments/', eventId]);
  }

  deleteAction(eventId: string) {
    this.service.deleteById(eventId).subscribe(() => {
      this.getAllData(this.currentMonth, this.currentYear, null);
    });
  }

  handleDatesSet(event: DatesSetArg) {
    if(event.view.type === 'dayGridMonth'){
      this.currentMonth = event.end.getMonth();
      this.currentYear = event.end.getFullYear();
      this.getAllData(this.currentMonth, this.currentYear, null);
    }
  }

  getAllData(month: number, year: number, radiologyExamType: string|null): void {
    this.service.getFullData(month, year, radiologyExamType)
    .pipe(
      map((resposne: AppointmentFullData[]) => {
        return resposne.map((app: AppointmentFullData) => {
          this.appointments.push(app);
          return {
            id: app.id,
            title: `[${app.examTypeName ? app.examTypeName : ''}] ${app.patientFirstName} [${app.medicalOfficeName}]`,
            start: `${app.appointmentDate}T${app.appointmentStartHour}`,
            end: `${app.appointmentDate}T"${app.appointmentEndHour}"`,
            color: `${app.examTypeColor ? app.examTypeColor : 'red'}`
          }
        });
      })
    )
    .subscribe(response =>  {
      this.calendarEvents =  response;
    });
  }

  addStudy(eventId: string) {
    console.log('eventId ',eventId);
    this.router.navigate(['/radiology-exams/main'], { queryParams: { appointmentId: eventId } });
  }

  onSelectChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    console.log('Selected radiology exam type ID:', selectedId);
    this.getAllData(this.currentMonth, this.currentYear, selectedId);
  }
}
