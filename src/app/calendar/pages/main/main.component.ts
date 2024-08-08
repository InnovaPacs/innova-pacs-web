import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, bootstrapPlugin],
    initialView: 'dayGridMonth',
    // other options here
  };
}
