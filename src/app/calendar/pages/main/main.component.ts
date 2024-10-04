import { Component, inject, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { map } from 'rxjs';
import { Appointment } from '../../../appointments/interfaces/appointment.interface';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  private service = inject(AppointmentService);
  private router = inject(Router);
  private currentMonth: number = 0;
  private currentYear: number = 0;
  
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

  handleEventClick(arg:any) {
    const eventId = arg.event.id;
    this.openModal(eventId);
  }

  ngOnInit(): void {

  }

  openModal(eventId: string) {
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
      this.getAllData(this.currentMonth, this.currentYear);
    });
  }

  handleDatesSet(event: DatesSetArg) {
    console.log(event.view.type);

    if(event.view.type === 'dayGridMonth'){
      this.currentMonth = event.end.getMonth();
      this.currentYear = event.end.getFullYear();

      this.getAllData(this.currentMonth, this.currentYear);
    }
  }

  getAllData(month: number, year: number): void {
    this.service.getFullData(month, year)
    .pipe(
      map((resposne: Appointment[]) => {
        return resposne.map((app: Appointment) => {
          return {
            id: app.id,
            title: `${app.patient.firstName} ${app.patient.lastName} [${app.medicalOffice.name}]`,
            start: `${app.appointmentDate}T${app.appointmentStartHour}`,
            end: `${app.appointmentDate}T"${app.appointmentEndHour}"`
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
}
