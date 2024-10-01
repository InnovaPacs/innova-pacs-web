import { Component, inject, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';
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
    eventClick: this.handleEventClick.bind(this)
  };

  public calendarEvents: CalendarEvent[] = [];

  handleEventClick(arg:any) {
    const eventId = arg.event.id;
    this.openModal(eventId);
  }

  ngOnInit(): void {
    this.service.getFullData()
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
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.editAction(eventId);
      } else if (result.isDismissed) {
        this.deleteAction(eventId);
      }
    });
  }

  editAction(eventId: string) {
    this.router.navigate(['/appointments/', eventId]);
  }

  deleteAction(eventId: string) {
    this.service.deleteById(eventId).subscribe(() => {
      this.ngOnInit()
    });
  }
}
