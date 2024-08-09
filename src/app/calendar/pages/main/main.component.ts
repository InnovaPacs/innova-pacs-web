import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
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

  calendarEvents = [
    { id: '1', title: 'Jose Luis Campos Bautista [Vista]', start: '2024-08-05T14:00:00', end: '2024-08-05T15:00:00' },
    { id: '2', title: 'Laura Campos Bautista [Test]', start: '2024-08-05T15:00:00', end: '2024-08-05T16:00:00' },
    { id: '3', title: 'Lupita Campos Bautista [Vista]', start: '2024-08-08T14:00:00', end: '2024-08-08T16:00:00' }
  ];

  handleEventClick(arg:any) {
    const eventId = arg.event.id;
    console.log('Evento ID:', arg.event.id );
  }
}
